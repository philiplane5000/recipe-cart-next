import { Button } from '@/ui/components/atoms/Button';
import { H1 } from '@/ui/components/atoms/H1';
import { H2 } from '@/ui/components/atoms/H2';
import { H3 } from '@/ui/components/atoms/H3';
import { H4 } from '@/ui/components/atoms/H4';
import { H5 } from '@/ui/components/atoms/H5';
import { H6 } from '@/ui/components/atoms/H6';

export default function Typography() {
  return (
    <div className="mx-auto min-h-screen max-w-prose space-y-8 p-8">
      <section>
        <H1>Heading 1 — Normal</H1>
        <H1 weight="strong">Heading 1 — Strong</H1>
        <H1 theme="brand">Heading 1 — Brand</H1>
        <H1 theme="accent">Heading 1 — Accent</H1>
        <H1 weight="strong" theme="brand">
          Heading 1 — Strong + Brand Theme
        </H1>
      </section>

      <section>
        <H2>Heading 2 — Normal</H2>
        <H2 weight="strong">Heading 2 — Strong</H2>
        <H2 theme="brand">Heading 2 — Brand</H2>
        <H2 theme="accent">Heading 2 — Accent</H2>
        <H2 weight="strong" theme="brand">
          Heading 2 — Strong + Brand Theme
        </H2>
      </section>

      <section>
        <H3>Heading 3 — Normal</H3>
        <H3 weight="strong">Heading 3 — Strong</H3>
        <H3 theme="brand">Heading 3 — Brand</H3>
        <H3 theme="accent">Heading 3 — Accent</H3>
        <H3 weight="strong" theme="brand">
          Heading 3 — Strong + Brand Theme
        </H3>
      </section>

      <section>
        <H4>Heading 4 — Normal</H4>
        <H4 weight="strong">Heading 4 — Strong</H4>
        <H4 theme="brand">Heading 4 — Brand</H4>
        <H4 theme="accent">Heading 4 — Accent</H4>
        <H4 weight="strong" theme="brand">
          Heading 4 — Strong + Brand Theme
        </H4>
      </section>

      <section>
        <H5>Heading 5 — Normal</H5>
        <H5 weight="strong">Heading 5 — Strong</H5>
        <H5 theme="brand">Heading 5 — Brand</H5>
        <H5 theme="accent">Heading 5 — Accent</H5>
        <H5 weight="strong" theme="brand">
          Heading 5 — Strong + Brand Theme
        </H5>
      </section>

      <section>
        <H6>Heading 6 — Normal</H6>
        <H6 weight="strong">Heading 6 — Strong</H6>
        <H6 theme="brand">Heading 6 — Brand</H6>
        <H6 theme="accent">Heading 6 — Accent</H6>
        <H6 weight="strong" theme="brand">
          Heading 6 — Strong + Brand Theme
        </H6>
      </section>

      <section className="mt-8">
        <H2 theme="accent">Paragraph</H2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
          lorem eu quam bibendum scelerisque id et dolor. Nulla sit amet metus
          purus. Suspendisse at placerat libero. Sed vitae nisl semper, volutpat
          turpis at, facilisis urna. Donec eget odio elementum, molestie nulla
          a, viverra sem. Aliquam scelerisque, sem vel consequat suscipit, ex
          velit suscipit est, vitae lobortis mi nibh eu augue. Maecenas feugiat,
          tellus nec eleifend eleifend, ipsum justo porttitor sapien, in mattis
          enim felis quis enim. Fusce at neque risus. Aenean fermentum nisl
          sapien, a vestibulum sapien pharetra ac. Pellentesque congue mi nulla,
          a auctor libero ornare eu. Nulla condimentum non ligula sit amet
          porta.
        </p>
        <p>
          Nulla facilisi. Integer fermentum mi vel semper tempus. Nullam
          vestibulum, risus at fermentum lacinia, erat lorem cursus turpis, a
          dignissim odio ante a mauris. Nulla quis vestibulum mi. Vestibulum
          feugiat tristique mauris, non lobortis diam elementum sit amet.
          Quisque facilisis, sem et vulputate consequat, augue sem aliquam
          tortor, et malesuada turpis nisi eget ipsum. Quisque quis tempor
          ligula. Vivamus porttitor urna eget mauris ornare, a vestibulum lacus
          viverra. Sed auctor tincidunt vestibulum. Aliquam iaculis erat nec
          quam egestas vehicula. Morbi ac tellus nibh.
        </p>
      </section>

      <section className="mt-8 flex flex-wrap gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="coral">Coral</Button>
        <Button variant="blush">Blush</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="quiet">Quiet</Button>
      </section>

      <section className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" isDisabled>Disabled Primary</Button>
        <Button variant="secondary" isDisabled>Disabled Secondary</Button>
        <Button variant="coral" isDisabled>Disabled Coral</Button>
        <Button variant="blush" isDisabled>Disabled Blush</Button>
        <Button variant="destructive" isDisabled>Disabled Destructive</Button>
        <Button variant="quiet" isDisabled>Disabled Quiet</Button>
      </section>
    </div>
  );
}
