import { requestJson } from '@/shared/api/requestJson.js';

import { FORECAST_DAYS } from '../constants.js';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const DAILY_FIELDS = Object.freeze([
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'relative_humidity_2m_mean',
  'pressure_msl_mean',
  'visibility_mean',
  'precipitation_probability_max',
  'sunrise',
  'sunset',
]);

function normalizeForecast({ current, daily }) {
  return {
    currentTemperature: current.temperature_2m,
    days: daily.time.map((date, index) => ({
      date,
      weatherCode: daily.weather_code[index],
      maxTemperature: daily.temperature_2m_max[index],
      minTemperature: daily.temperature_2m_min[index],
      windSpeed: daily.wind_speed_10m_max[index],
      windDirection: daily.wind_direction_10m_dominant[index],
      humidity: daily.relative_humidity_2m_mean[index],
      pressure: daily.pressure_msl_mean[index],
      visibility: daily.visibility_mean[index],
      precipitationProbability: daily.precipitation_probability_max[index],
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index],
    })),
  };
}

export async function fetchForecast({ latitude, longitude, signal }) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: DAILY_FIELDS.join(','),
    current: 'temperature_2m',
    timezone: 'auto',
    forecast_days: FORECAST_DAYS,
    wind_speed_unit: 'ms',
  });

  const data = await requestJson(`${FORECAST_URL}?${params}`, { signal });
  return normalizeForecast(data);
}
