'use client';

/* Core */
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* Instruments */
import styles from '../styles/layout.module.scss';

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
        href='/'>
        Home
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === '/upload' ? styles.active : ''
        }`}
        href='/upload'>
        upload
      </Link>
    </nav>
  );
};
