import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes.js';

import styles from './Logo.module.scss';

export default function Logo() {
  return (
    <Link to={ROUTES.root} className={styles.logo}>
      Teachinder
    </Link>
  );
}
