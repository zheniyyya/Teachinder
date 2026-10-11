import { checkIncludesIgnoreCase } from './helpers.js';

export function createSearchPredicate(query) {
  if (typeof query === 'number') {
    return (user) => user.age === query;
  }

  if (typeof query !== 'string') {
    throw new TypeError('The search parameter must be a string or a number');
  }

  const text = query.trim();
  if (text === '') {
    return () => false;
  }

  const isNumericQuery = /^\d+$/.test(text);

  return (user) =>
    (isNumericQuery && user.age === Number(text)) ||
    checkIncludesIgnoreCase(user.full_name, text) ||
    checkIncludesIgnoreCase(user.note, text);
}

export function findUser(users, query) {
  return users.find(createSearchPredicate(query)) ?? null;
}