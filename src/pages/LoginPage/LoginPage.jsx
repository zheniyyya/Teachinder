import { LoginForm } from '@/features/auth';
import Logo from '@/shared/components/Logo/Logo.jsx';

import styles from './LoginPage.module.scss';

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <Logo />

      <section className={styles.card} aria-labelledby="login-title">
        <h1 id="login-title" className={styles.title}>
          Log in to Teachinder
        </h1>
        <LoginForm />
      </section>
    </main>
  );
}
