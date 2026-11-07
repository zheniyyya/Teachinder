import { useId } from 'react';

import styles from './FormField.module.scss';

export default function FormField({ label, error, hint, ...inputProps }) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error || hint;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        className={styles.input}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />

      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  );
}
