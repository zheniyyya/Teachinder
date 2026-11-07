import { LOGIN_EXAMPLE } from '../constants.js';

const LOGIN_PATTERN = /^\p{L}+[1-6]$/u;

const WHITESPACE_PATTERN = /\s/;

const MIN_PASSWORD_LENGTH = 4;

function validateLogin(login) {
  const value = login.trim();

  if (value === '') {
    return 'Enter your login';
  }
  if (!LOGIN_PATTERN.test(value)) {
    return `Login must be your name followed by the course number (1-6), e.g. ${LOGIN_EXAMPLE}`;
  }
  return '';
}

function validatePassword(password) {
  if (password === '') {
    return 'Enter your password';
  }
  if (WHITESPACE_PATTERN.test(password)) {
    return 'Password must not contain spaces';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must contain at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return '';
}

export function validateLoginForm({ login, password }) {
  return {
    login: validateLogin(login),
    password: validatePassword(password),
  };
}
