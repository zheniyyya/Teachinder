const VALID_CREDENTIALS = Object.freeze({
  login: 'zhenia3',
  password: 'zhenia3',
});

export function normalizeLogin(login) {
  return login.trim().toLowerCase();
}

export function checkIsKnownUser(login) {
  return login === VALID_CREDENTIALS.login;
}

export function checkCredentials({ login, password }) {
  return checkIsKnownUser(normalizeLogin(login)) && password === VALID_CREDENTIALS.password;
}
