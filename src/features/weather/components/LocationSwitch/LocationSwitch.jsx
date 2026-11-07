import { DEFAULT_LOCATION } from '../../constants.js';
import styles from './LocationSwitch.module.scss';

export default function LocationSwitch({ isCurrentLocation, isLocating, error, onSelectDefault, onSelectCurrent }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.switch} role="group" aria-label="Weather location">
        <button
          type="button"
          className="btn"
          aria-pressed={!isCurrentLocation}
          disabled={isLocating}
          onClick={onSelectDefault}
        >
          {DEFAULT_LOCATION.name}
        </button>
        <button
          type="button"
          className="btn"
          aria-pressed={isCurrentLocation}
          disabled={isLocating}
          onClick={onSelectCurrent}
        >
          📍 My location
        </button>
      </div>

      {error && (
        <p className={styles.notice} role="alert">
          {error}. Showing the weather for {DEFAULT_LOCATION.name}.
        </p>
      )}
    </div>
  );
}
