import { getWeatherCondition } from '../../lib/conditions.js';
import {
  formatPercent,
  formatPressure,
  formatTemperature,
  formatVisibility,
  formatWindSpeed,
  getCompassPoint,
} from '../../lib/format.js';
import styles from './WeatherCard.module.scss';

const WIND_ARROW_OFFSET_DEG = 180;

function getDetails(day) {
  return [
    { label: 'Humidity', value: formatPercent(day.humidity) },
    { label: 'Visibility', value: formatVisibility(day.visibility) },
    { label: 'Pressure', value: formatPressure(day.pressure) },
    { label: 'Precipitation', value: formatPercent(day.precipitationProbability) },
  ];
}

export default function WeatherCard({ title, day }) {
  const condition = getWeatherCondition(day.weatherCode);
  const hasWindDirection = day.windDirection !== null;

  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.condition}>
        <span className={styles.icon} aria-hidden="true">
          {condition.icon}
        </span>
        <span>{condition.label}</span>
      </div>

      <p className={styles.temperature}>
        <span>Max: {formatTemperature(day.maxTemperature)}</span>
        <span>Min: {formatTemperature(day.minTemperature)}</span>
      </p>

      <p className={styles.wind}>
        {hasWindDirection && (
          <span
            className={styles.windArrow}
            style={{ rotate: `${day.windDirection + WIND_ARROW_OFFSET_DEG}deg` }}
            aria-hidden="true"
          >
            ↑
          </span>
        )}
        <span>
          {getCompassPoint(day.windDirection)} {formatWindSpeed(day.windSpeed)}
        </span>
      </p>

      <dl className={styles.details}>
        {getDetails(day).map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
