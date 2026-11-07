import { useCallback, useState } from 'react';

import { fetchPlace } from '../api/geocodingApi.js';
import { CURRENT_LOCATION_NAME, DEFAULT_LOCATION } from '../constants.js';
import { getCurrentPosition } from '../lib/geolocation.js';

async function detectCurrentLocation() {
  const coordinates = await getCurrentPosition();
  const place = await fetchPlace(coordinates).catch(() => null);

  return {
    ...coordinates,
    name: place?.name ?? CURRENT_LOCATION_NAME,
    country: place?.country ?? '',
  };
}

export function useWeatherLocation() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  const selectCurrentLocation = useCallback(async () => {
    setIsLocating(true);
    setError('');

    try {
      setLocation(await detectCurrentLocation());
    } catch (locationError) {
      setLocation(DEFAULT_LOCATION);
      setError(locationError.message);
    } finally {
      setIsLocating(false);
    }
  }, []);

  const selectDefaultLocation = useCallback(() => {
    setLocation(DEFAULT_LOCATION);
    setError('');
  }, []);

  return {
    location,
    isCurrentLocation: location !== DEFAULT_LOCATION,
    isLocating,
    error,
    selectCurrentLocation,
    selectDefaultLocation,
  };
}
