import { find, isNumber, isString, overSome } from 'lodash-es';
import { checkIncludesIgnoreCase } from './helpers.js';

export function createSearchPredicate(query) {
  if (isNumber(query)) {
    return (user) => user.age === query;
  }

  if (!isString(query)) {
    throw new TypeError('The search parameter must be a string or a number');
  }

  const text = query.trim();
  if (text === '') {
    return () => false;
  }

  const isNumericQuery = /^\d+$/.test(text);

  return overSome([
    (user) => isNumericQuery && user.age === Number(text),
    (user) => checkIncludesIgnoreCase(user.full_name, text),
    (user) => checkIncludesIgnoreCase(user.note, text),
  ]);
}

export function findUser(users, query) {
  return find(users, createSearchPredicate(query)) ?? null;
}