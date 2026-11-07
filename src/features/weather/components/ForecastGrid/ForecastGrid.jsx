import { formatDayTitle } from '../../lib/format.js';
import WeatherCard from '../WeatherCard/WeatherCard.jsx';
import styles from './ForecastGrid.module.scss';

export default function ForecastGrid({ days }) {
  return (
    <ul className={styles.grid}>
      {days.map((day, index) => (
        <li key={day.date}>
          <WeatherCard title={formatDayTitle(day.date, index)} day={day} />
        </li>
      ))}
    </ul>
  );
}
