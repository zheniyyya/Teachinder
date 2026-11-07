import { Link } from 'react-router';

import Logo from '@/shared/components/Logo/Logo.jsx';
import { ROUTES } from '@/shared/config/routes.js';

import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <Logo />
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>This page does not exist.</p>
      <Link to={ROUTES.dashboard} className="btn">
        Back to dashboard
      </Link>
    </main>
  );
}
