import ErrorMessage from '@/shared/components/ErrorMessage/ErrorMessage.jsx';
import Loader from '@/shared/components/Loader/Loader.jsx';

import { REQUEST_STATUS } from '../../constants.js';
import ForecastGrid from '../ForecastGrid/ForecastGrid.jsx';

export default function ForecastContent({ isLocating, status, forecast, error, onRetry }) {
  if (isLocating) {
    return <Loader label="Detecting your location..." />;
  }
  if (status === REQUEST_STATUS.loading) {
    return <Loader label="Loading weather forecast..." />;
  }
  if (status === REQUEST_STATUS.error) {
    return <ErrorMessage message={`Could not load the weather forecast: ${error}.`} onRetry={onRetry} />;
  }
  return <ForecastGrid days={forecast.days} />;
}
