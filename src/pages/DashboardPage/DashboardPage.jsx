import { ForecastContent, ForecastHeader, LocationSwitch, useForecast, useWeatherLocation } from '@/features/weather';

import styles from './DashboardPage.module.scss';

export default function DashboardPage() {
  const {
    location,
    isCurrentLocation,
    isLocating,
    error: locationError,
    selectCurrentLocation,
    selectDefaultLocation,
  } = useWeatherLocation();
  const { status, forecast, error, retry } = useForecast(location);

  return (
    <div className={styles.dashboard}>
      <ForecastHeader location={location} forecast={forecast} />

      <LocationSwitch
        isCurrentLocation={isCurrentLocation}
        isLocating={isLocating}
        error={locationError}
        onSelectDefault={selectDefaultLocation}
        onSelectCurrent={selectCurrentLocation}
      />

      <ForecastContent isLocating={isLocating} status={status} forecast={forecast} error={error} onRetry={retry} />
    </div>
  );
}
