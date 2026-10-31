import { filter, isBoolean, isFinite, isNil, isPlainObject, isString, map, overEvery, pickBy } from 'lodash-es';
import { FILTERABLE_FIELDS } from './constants.js';

import { compareIgnoreCase } from './helpers.js';

function getAgeRange(age) {
  if (isFinite(age)) {
    return { min: age, max: age };
  }

  if (isPlainObject(age)) {
    const { min = 0, max = Infinity } = age;
    return { min, max };
  }

  if (isString(age)) {
    const text = age.trim();
    const range = text.match(/^(\d+)\s*-\s*(\d+)$/);
    const fromAge = text.match(/^(\d+)\s*\+$/);

    if (range) {
      return { min: Number(range[1]), max: Number(range[2]) };
    }
    if (fromAge) {
      return { min: Number(fromAge[1]), max: Infinity };
    }
    if (/^\d+$/.test(text)) {
      return { min: Number(text), max: Number(text) };
    }
  }

  throw new TypeError(`Invalid age parameter: ${JSON.stringify(age)}`);
}

function checkIsActiveFilterValue(value) {
  if (isNil(value) || value === '') {
    return false;
  }
  return !compareIgnoreCase(value, 'any');
}

function createFieldPredicate(field, value) {
  switch (field) {
    case 'country':
    case 'gender':
      return (user) => compareIgnoreCase(user[field], value);

    case 'favorite':
      if (!isBoolean(value)) {
        throw new TypeError('The favorite parameter must be a boolean');
      }
      return (user) => user.favorite === value;

    case 'age': {
      const { min, max } = getAgeRange(value);
      return (user) => isFinite(user.age) && user.age >= min && user.age <= max;
    }

    default:
      throw new Error(
        `Unsupported filter parameter "${field}". Available: ${FILTERABLE_FIELDS.join(', ')}`,
      );
  }
}

export function createUsersFilter(filters = {}) {
  const activeFilters = pickBy(filters, checkIsActiveFilterValue);
  return overEvery(map(activeFilters, (value, field) => createFieldPredicate(field, value)));
}

export function filterUsers(users, filters = {}) {
  return filter(users, createUsersFilter(filters));
}