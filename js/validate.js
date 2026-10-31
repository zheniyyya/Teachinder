import { includes, inRange, isEmpty, isFinite, isString } from 'lodash-es';
import {
  CAPITALIZED_FIELDS,
  DEFAULT_PHONE_FORMAT,
  EMAIL_PATTERN,
  MAX_PHONE_DIGITS,
  MIN_PHONE_DIGITS,
  OPTIONAL_FIELDS,
  PHONE_FORMATS,
} from './constants.js';

import { checkStartsWithCapital } from './helpers.js';

function checkIsValidCapitalizedField(value, field) {
  const isEmptyOptional = includes(OPTIONAL_FIELDS, field) && value === '';
  return isEmptyOptional || checkStartsWithCapital(value);
}



export function checkIsValidAge(age) {
  return isFinite(age) && age >= 0;
}

export function checkIsValidPhone(phone, country) {
  if (!isString(phone)) {
    return false;
  }

  const countryFormat = PHONE_FORMATS[country];
  if (countryFormat) {
    return countryFormat.pattern.test(phone);
  }

  const digitsCount = phone.replace(/\D/g, '').length;
  return DEFAULT_PHONE_FORMAT.test(phone) && inRange(digitsCount, MIN_PHONE_DIGITS, MAX_PHONE_DIGITS + 1);
}




function getPhoneErrorMessage(country) {
  const countryFormat = PHONE_FORMATS[country];

  if (countryFormat) {
    return `does not match the phone format for "${country}", e.g. ${countryFormat.example}`;
  }
  return country
    ? `does not match the phone format for "${country}"`
    : 'does not match the international phone format';
}




export function checkIsValidEmail(email) {
  return isString(email) && EMAIL_PATTERN.test(email);
}




export function validateUser(user) {
  const errors = {};

  for (const field of CAPITALIZED_FIELDS) {
    if (!checkIsValidCapitalizedField(user[field], field)) {
      errors[field] = 'must be a string starting with a capital letter';
    }
  }

  if (!checkIsValidAge(user.age)) {
    errors.age = 'must be a number';
  }

  if (!checkIsValidPhone(user.phone, user.country)) {
    errors.phone = getPhoneErrorMessage(user.country);
  }

  if (!checkIsValidEmail(user.email)) {
    errors.email = 'does not match the email format (name@domain.com)';
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
}

export function checkIsUserValid(user) {
  return validateUser(user).isValid;
}