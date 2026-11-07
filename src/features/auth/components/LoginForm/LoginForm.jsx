import FormField from '@/shared/components/FormField/FormField.jsx';

import { LOGIN_EXAMPLE } from '../../constants.js';
import { useLoginForm } from '../../hooks/useLoginForm.js';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const { values, authError, getFieldError, handleChange, handleBlur, handleSubmit } = useLoginForm();

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField
        label="Login"
        name="login"
        type="text"
        autoComplete="username"
        placeholder={LOGIN_EXAMPLE}
        value={values.login}
        error={getFieldError('login')}
        hint="Your name followed by the course number"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••"
        value={values.password}
        error={getFieldError('password')}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <label className={styles.remember}>
        <input type="checkbox" name="remember" checked={values.remember} onChange={handleChange} />
        Remember me
      </label>

      {authError && (
        <p className={styles.authError} role="alert">
          {authError}
        </p>
      )}

      <button type="submit" className={`btn btn--filled ${styles.submit}`}>
        Log in
      </button>
    </form>
  );
}
