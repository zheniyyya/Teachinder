const GEOLOCATION_OPTIONS = Object.freeze({
  timeout: 10000,
  maximumAge: 5 * 60 * 1000,
});

const GEOLOCATION_ERRORS = Object.freeze({
  1: 'Access to your location was denied',
  2: 'Your location is unavailable',
  3: 'Getting your location took too long',
});

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Your browser does not support geolocation'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) => reject(new Error(GEOLOCATION_ERRORS[error.code] ?? 'Could not get your location')),
      GEOLOCATION_OPTIONS,
    );
  });
}
