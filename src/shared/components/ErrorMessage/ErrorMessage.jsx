import styles from './ErrorMessage.module.scss';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
