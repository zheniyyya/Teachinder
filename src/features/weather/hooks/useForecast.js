import { useCallback, useEffect, useState } from 'react';

import { fetchForecast } from '../api/forecastApi.js';
import { REQUEST_STATUS } from '../constants.js';

const LOADING_STATE = Object.freeze({ status: REQUEST_STATUS.loading, forecast: null, error: '' });

export function useForecast({ latitude, longitude }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const requestKey = `${latitude},${longitude},${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    fetchForecast({ latitude, longitude, signal: controller.signal })
      .then((forecast) => setResult({ requestKey, status: REQUEST_STATUS.success, forecast, error: '' }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({ requestKey, status: REQUEST_STATUS.error, forecast: null, error: error.message });
        }
      });

    return () => controller.abort();
  }, [latitude, longitude, requestKey]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  const { status, forecast, error } = result?.requestKey === requestKey ? result : LOADING_STATE;

  return { status, forecast, error, retry };
}
