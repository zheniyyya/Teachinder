const COOKIE_BASE_ATTRIBUTES = Object.freeze(['path=/', 'SameSite=Lax']);

export function readCookie(name) {
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

export function writeCookie(name, value, { maxAge } = {}) {
  const attributes = maxAge ? [...COOKIE_BASE_ATTRIBUTES, `max-age=${maxAge}`] : COOKIE_BASE_ATTRIBUTES;

  document.cookie = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`, ...attributes].join('; ');
}

export function deleteCookie(name) {
  writeCookie(name, '', { maxAge: -1 });
}
