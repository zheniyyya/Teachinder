import { Outlet } from 'react-router';

import { UserMenu } from '@/features/auth';
import Logo from '@/shared/components/Logo/Logo.jsx';

import styles from './AppLayout.module.scss';

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Logo />
        <UserMenu />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
