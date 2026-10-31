import { deburr, includes, isNil, isString, orderBy, partition } from 'lodash-es';
import { SORTABLE_FIELDS, SORT_ORDER } from './constants.js';

function getSortValue(user, field) {
  const value = user[field];

  if (isNil(value) || value === '') {
    return null;
  }

  if (field === 'b_day') {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }

  return isString(value) ? deburr(value).toLowerCase() : value;
}

export function sortUsers(users, field, order = SORT_ORDER.ASC) {
  if (!includes(SORTABLE_FIELDS, field)) {
    throw new Error(`Cannot sort by field "${field}". Available: ${SORTABLE_FIELDS.join(', ')}`);
  }
  if (order !== SORT_ORDER.ASC && order !== SORT_ORDER.DESC) {
    throw new Error(`Invalid sort order "${order}". Available: asc, desc`);
  }

  const getValue = (user) => getSortValue(user, field);
  const [usersWithValue, usersWithoutValue] = partition(users, (user) => getValue(user) !== null);

  // Users without a value always go to the end, whatever the order
  return [...orderBy(usersWithValue, [getValue], [order]), ...usersWithoutValue];
}
