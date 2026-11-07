import { requestJson } from '@/shared/api/requestJson.js';

const REVERSE_GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse';

const CITY_ZOOM_LEVEL = 12;

export async function fetchPlace({ latitude, longitude }) {
  const params = new URLSearchParams({
    lat: latitude,
    lon: longitude,
    format: 'jsonv2',
    zoom: CITY_ZOOM_LEVEL,
    'accept-language': 'en',
  });

  const { address = {}, name } = await requestJson(`${REVERSE_GEOCODING_URL}?${params}`);

  return {
    name: address.city ?? address.town ?? address.village ?? address.municipality ?? name,
    country: address.country ?? '',
  };
}
