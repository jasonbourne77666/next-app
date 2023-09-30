import Link from 'next/link';

export default async function Home() {
  return (
    <main>
      <Link href={'/practice'}>practice</Link>
      <br />
      <Link href={'/counter'}>counter</Link>
      <br />
      <Link href={'/upload'}>upload</Link>
    </main>
  );
}
