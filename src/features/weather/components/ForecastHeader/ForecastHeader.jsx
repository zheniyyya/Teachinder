import { FORECAST_DAYS } from '../../constants.js';
import { formatTemperature, formatTime } from '../../lib/format.js';
import styles from './ForecastHeader.module.scss';

function getTodaySummary({ currentTemperature, days: [today] }) {
  return [
    { label: 'Now', value: formatTemperature(currentTemperature) },
    { label: 'Sunrise', value: formatTime(today.sunrise) },
    { label: 'Sunset', value: formatTime(today.sunset) },
  ];
}

export default function ForecastHeader({ location, forecast }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.place}>
          {location.name}
          {location.country && <span className={styles.country}>{location.country}</span>}
        </h1>
        <p className={styles.subtitle}>{FORECAST_DAYS}-day weather forecast</p>
      </div>

      {forecast && (
        <dl className={styles.summary}>
          {getTodaySummary(forecast).map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
