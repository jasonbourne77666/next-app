import Link from 'next/link';
import styles from './SidebarLayout.module.scss';

export interface ISidebarLayout {}

const SidebarLayout: React.FC<ISidebarLayout> = () => {
  return (
    <nav className={styles.nav}>
      <input className={styles.input} placeholder="Search..." />
      <Link href="/">Home</Link>
      <Link href="/css">css</Link>
      <Link href="/svg">svg</Link>
    </nav>
  );
};

export default SidebarLayout;
