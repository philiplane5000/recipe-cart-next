import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const COLLECTION = 'recipes';
const SCHEMA_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  'recipe-validation-schema.json',
);

/**
 * Applies recipe-validation-schema.json to the `recipes` collection as a
 * MongoDB document validator.
 *
 * Collection validators live in the collection's options, inside the same data
 * files as the documents — so this survives `docker compose down`/`up` and only
 * needs re-running after `down -v`, a fresh clone, or a schema change. It is
 * idempotent: `collMod` overwrites any previous validator.
 *
 * Existing documents are NOT re-checked when a validator is attached, so this
 * verifies conformance first and refuses to install if anything already stored
 * would fail. Without that guard, `validationLevel: 'strict'` would make those
 * documents un-updatable. Pass --force to install anyway.
 *
 * Run: npm run db:validator
 *
 * `--soft` downgrades every failure to a warning and exits 0. The `predev`
 * hook uses it so that a stopped database, an absent .env.local, or documents
 * needing attention never block `npm run dev` — front-end work shouldn't
 * require Docker. For that to hold, every failure has to be reachable by the
 * `.catch()` at the bottom of this file: hence `--env-file-if-exists` in the
 * `db:validator` script and the dynamic import of the db client below.
 */
const SOFT = process.argv.includes('--soft');

async function installValidator() {
  const validator = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
  // Imported here, not at module scope: src/lib/db/client throws while its
  // module body evaluates when MONGODB_URI is unset, and that happens before
  // the .catch() below is attached — so --soft could never see it, and the
  // predev hook hard-failed `npm run dev` on any checkout without .env.local.
  const { getDb } = await import('@/lib/db/client');
  const db = await getDb();

  const existing = await db.listCollections({ name: COLLECTION }).toArray();
  const collection = db.collection(COLLECTION);

  if (existing.length > 0) {
    const total = await collection.countDocuments();
    // $nor inverts the schema: match everything that does NOT satisfy it.
    const nonConforming = await collection.countDocuments({
      $nor: [validator],
    });

    console.log(`Existing documents: ${total}`);
    console.log(`Would fail schema : ${nonConforming}`);

    if (nonConforming > 0 && !process.argv.includes('--force')) {
      const offenders = await collection
        .find({ $nor: [validator] }, { projection: { name: 1 } })
        .limit(5)
        .toArray();
      console.error(
        `\nRefusing to install: ${nonConforming} document(s) would fail.\n` +
          `With validationLevel "strict" they could no longer be updated.\n` +
          `Fix or remove them, or re-run with --force.\n\nFirst offenders:`,
      );
      for (const doc of offenders) {
        console.error(`  ${doc._id}  ${JSON.stringify(doc.name)}`);
      }
      if (!SOFT) process.exitCode = 1;
      return;
    }

    await db.command({
      collMod: COLLECTION,
      validator,
      validationLevel: 'strict',
      validationAction: 'error',
    });
    console.log(`\nValidator applied to an existing "${COLLECTION}".`);
  } else {
    await db.createCollection(COLLECTION, {
      validator,
      validationLevel: 'strict',
      validationAction: 'error',
    });
    console.log(`Created "${COLLECTION}" with the validator attached.`);
  }

  // listCollections' element type omits `options` unless nameOnly is false.
  const [info] = await db
    .listCollections({ name: COLLECTION }, { nameOnly: false })
    .toArray();
  const options = info?.options ?? {};
  console.log(`Verified attached : ${options.validator ? 'yes' : 'NO'}`);
  console.log(`validationLevel   : ${options.validationLevel}`);
  console.log(`validationAction  : ${options.validationAction}`);
}

installValidator()
  .catch((reason) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    if (SOFT) {
      console.warn(
        `\n[db:validator] Skipped — ${message}\n` +
          `The dev server will still start, but the recipes collection is\n` +
          `unvalidated. Create .env.local with MONGODB_URI (see CLAUDE.md), run\n` +
          `"docker compose up -d", then "npm run db:validator".\n`,
      );
      return;
    }
    console.error('Failed to install validator:', reason);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
