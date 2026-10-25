const RANDOM_USER_URL = 'https://randomuser.me/api/';
const RANDOM_USER_FIELDS = Object.freeze(['gender', 'name', 'location', 'email', 'dob', 'phone', 'id', 'picture']);

const TEACHERS_URL = 'http://localhost:3000/teachers';

const REQUEST_TIMEOUT_MS = 10000;

async function requestJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, { ...options, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    const reason = error.name === 'TimeoutError' ? 'the server did not respond in time' : 'the server is unavailable';
    throw new Error(reason, { cause: error });
  }

  if (!response.ok) {
    throw new Error(`the server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchRandomUsers({ results, page, seed }) {
  const params = new URLSearchParams({ results, page, seed, inc: RANDOM_USER_FIELDS.join(',') });
  const data = await requestJson(`${RANDOM_USER_URL}?${params}`);

  if (data.error) {
    throw new Error(data.error);
  }
  return data.results;
}

export function fetchSavedTeachers() {
  return requestJson(TEACHERS_URL);
}

export function saveTeacher(teacher) {
  return requestJson(TEACHERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacher),
  });
}
