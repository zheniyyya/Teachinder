const COMPASS_POINTS = Object.freeze(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']);

const DEGREES_PER_COMPASS_POINT = 360 / COMPASS_POINTS.length;

const RELATIVE_DAY_TITLES = Object.freeze(['Today', 'Tomorrow']);

const NO_DATA = '—';

const dayFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

function withFallback(format) {
  return (value) => (value === null || value === undefined ? NO_DATA : format(value));
}

export const getCompassPoint = withFallback(
  (degrees) => COMPASS_POINTS[Math.round(degrees / DEGREES_PER_COMPASS_POINT) % COMPASS_POINTS.length],
);

export function formatDayTitle(date, index) {
  return RELATIVE_DAY_TITLES[index] ?? dayFormatter.format(new Date(`${date}T00:00:00Z`));
}

export const formatTime = withFallback((dateTime) => dateTime.split('T')[1]);

export const formatTemperature = withFallback((celsius) => `${Math.round(celsius)}°C`);

export const formatWindSpeed = withFallback((speed) => `${speed.toFixed(1)} m/s`);

export const formatPercent = withFallback((percent) => `${Math.round(percent)}%`);

export const formatPressure = withFallback((pressure) => `${Math.round(pressure)} hPa`);

export const formatVisibility = withFallback((meters) => `${(meters / 1000).toFixed(1)} km`);
