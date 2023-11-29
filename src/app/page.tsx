import Link from 'next/link';
// 计算日期差
export function getDaysDiffBetweenDates(dateInitial: Date, dateFinal: Date) {
  return (dateFinal.getTime() - dateInitial.getTime()) / (1000 * 3600 * 24);
}

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
