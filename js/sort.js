import { SORTABLE_FIELDS, SORT_ORDER } from './constants.js';

function getSortValue(user, field) {
  const value = user[field];

  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (field === 'b_day') {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }

  return value;
}

function compareValues(first, second) {
  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }
  return String(first).localeCompare(String(second));
}

export function sortUsers(users, field, order = SORT_ORDER.ASC) {
  if (!SORTABLE_FIELDS.includes(field)) {
    throw new Error(`Cannot sort by field "${field}". Available: ${SORTABLE_FIELDS.join(', ')}`);
  }
  if (order !== SORT_ORDER.ASC && order !== SORT_ORDER.DESC) {
    throw new Error(`Invalid sort order "${order}". Available: asc, desc`);
  }

  const direction = order === SORT_ORDER.ASC ? 1 : -1;

  return [...users].sort((firstUser, secondUser) => {
    const first = getSortValue(firstUser, field);
    const second = getSortValue(secondUser, field);

    if (first === null && second === null) return 0;
    if (first === null) return 1;
    if (second === null) return -1;

    return direction * compareValues(first, second);
  });
}