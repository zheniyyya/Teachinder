const REQUEST_TIMEOUT_MS = 10000;

function createRequestSignal(signal) {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
}

export async function requestJson(url, { signal } = {}) {
  let response;

  try {
    response = await fetch(url, { signal: createRequestSignal(signal) });
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    const reason = error.name === 'TimeoutError' ? 'the server did not respond in time' : 'the server is unavailable';
    throw new Error(reason, { cause: error });
  }

  if (!response.ok) {
    throw new Error(`the server responded with status ${response.status}`);
  }
  return response.json();
}
