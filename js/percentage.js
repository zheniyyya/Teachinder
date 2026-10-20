import { createUsersFilter } from './filter.js';
import { checkIsPlainObject, roundTo } from './helpers.js';
import { createSearchPredicate } from './search.js';

function createConditionPredicate(condition) {
  if (typeof condition === 'function') {
    return condition;
  }
  if (checkIsPlainObject(condition)) {
    return createUsersFilter(condition);
  }
  return createSearchPredicate(condition);
}

export function getMatchPercentage(users, condition) {
  if (!Array.isArray(users) || users.length === 0) {
    return 0;
  }

  const matchedCount = users.filter(createConditionPredicate(condition)).length;
  return roundTo((matchedCount / users.length) * 100, 2);
}