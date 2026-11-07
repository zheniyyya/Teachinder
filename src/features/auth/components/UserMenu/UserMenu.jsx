import { useAuth } from '../../hooks/useAuth.js';
import styles from './UserMenu.module.scss';

export default function UserMenu() {
  const { user, signOut } = useAuth();

  return (
    <div className={styles.menu}>
      <span className={styles.greeting}>
        Hi, <strong>{user}</strong>
      </span>
      <button type="button" className="btn" onClick={signOut}>
        Log out
      </button>
    </div>
  );
}
