import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="rounded-tr-2xl rounded-bl-2xl border-2 border-black p-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={200}
          height={40}
          priority
        />
      </main>
    </div>
  );
}
