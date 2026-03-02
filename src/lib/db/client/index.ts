import { MongoClient, Db, type MongoClient as TMongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

if (!process.env.MONGODB_DB_NAME) {
  throw new Error('Missing environment variable: "MONGODB_DB_NAME"');
}

const dbName = process.env.MONGODB_DB_NAME;

if (!process.env.MONGODB_APP_NAME) {
  throw new Error('Missing environment variable: "MONGODB_APP_NAME"');
}

const options = {
  appName: process.env.MONGODB_APP_NAME,
  authSource: 'admin',
};

// Define a global type to persist the client in development
const globalObject = global as typeof globalThis & {
  _mongoClientPromise?: Promise<TMongoClient>;
};

/**
 * Ensures a single, cached connection to the MongoDB cluster
 * @returns the client instance
 */
export default async function getMongoClient(): Promise<TMongoClient> {
  // In Production: Always create a new client (serverless/cold start friendly)
  if (process.env.NODE_ENV === 'production') {
    const client = new MongoClient(uri, options);
    return client.connect();
  }

  // In Development: Use a global variable to preserve the connection across HMR
  if (!globalObject._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalObject._mongoClientPromise = client.connect();
  }

  return globalObject._mongoClientPromise;
}

/**
 * Helper to get the Database instance
 * @returns the database instance directly
 */
export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}
