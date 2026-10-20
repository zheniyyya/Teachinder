import { FILTERABLE_FIELDS } from './constants.js';

import { checkIsPlainObject, compareIgnoreCase } from './helpers.js';

function getAgeRange(age) {
  if (typeof age === 'number' && Number.isFinite(age)) {
    return { min: age, max: age };
  }

  if (checkIsPlainObject(age)) {
    const { min = 0, max = Infinity } = age;
    return { min, max };
  }

  if (typeof age === 'string') {
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
  if (value === undefined || value === null || value === '') {
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
      if (typeof value !== 'boolean') {
        throw new TypeError('The favorite parameter must be a boolean');
      }
      return (user) => user.favorite === value;

    case 'age': {
      const { min, max } = getAgeRange(value);
      return (user) => typeof user.age === 'number' && user.age >= min && user.age <= max;
    }

    default:
      throw new Error(
        `Unsupported filter parameter "${field}". Available: ${FILTERABLE_FIELDS.join(', ')}`,
      );
  }
}

export function createUsersFilter(filters = {}) {
  const predicates = Object.entries(filters)
    .filter(([, value]) => checkIsActiveFilterValue(value))
    .map(([field, value]) => createFieldPredicate(field, value));

  return (user) => predicates.every((predicate) => predicate(user));
}

export function filterUsers(users, filters = {}) {
  return users.filter(createUsersFilter(filters));
}