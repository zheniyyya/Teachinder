import { capitalize, compact, find, findIndex, flatten, isBoolean, isNil, isPlainObject, isString, omitBy, sample } from 'lodash-es';
import { COURSES } from './constants.js';

import {
  calculateAge,
  checkIsHexColor,
  compareIgnoreCase,
  createRandomHexColor,
  createRandomId,
} from './helpers.js';

function getIdFromRandomUser(rawId) {
  const value = rawId?.value;
  if (!value || /NaN|undefined/.test(value)) {
    return null;
  }
  return `${rawId.name}${value}`;
}

function checkIsRandomUserInterface(user) {
  return isPlainObject(user.name);
}

function formatRandomUser(user) {
  const { name = {}, location = {}, dob = {}, picture = {} } = user;

  return {
    gender: user.gender,
    title: name.title,
    full_name: compact([name.first, name.last]).join(' '),
    city: location.city,
    state: location.state,
    country: location.country,
    postcode: location.postcode,
    coordinates: location.coordinates,
    timezone: location.timezone,
    email: user.email,
    b_day: dob.date,
    age: dob.age,
    phone: user.phone,
    picture_large: picture.large,
    picture_thumbnail: picture.thumbnail,
    id: getIdFromRandomUser(user.id),
  };
}

function normalizeUserInterface(user) {
  return checkIsRandomUserInterface(user) ? formatRandomUser(user) : { ...user };
}

export function checkIsSameUser(first, second) {
  if (first.id && second.id && first.id === second.id) {
    return true;
  }
  if (first.email && second.email) {
    return compareIgnoreCase(first.email, second.email);
  }
  return compareIgnoreCase(first.full_name, second.full_name);
}

function mergeUsers(target, source) {
  return { ...target, ...omitBy(source, isNil) };
}

function removeDuplicates(users) {
  const uniqueUsers = [];

  for (const user of users) {
    const duplicateIndex = findIndex(uniqueUsers, (uniqueUser) => checkIsSameUser(uniqueUser, user));

    if (duplicateIndex === -1) {
      uniqueUsers.push(user);
    } else {
      uniqueUsers[duplicateIndex] = mergeUsers(uniqueUsers[duplicateIndex], user);
    }
  }
  return uniqueUsers;
}

function getNormalizedCourse(course) {
  if (!isString(course)) {
    return null;
  }
  return find(COURSES, (item) => compareIgnoreCase(item, course)) ?? null;
}

function createUniqueId(preferredId, usedIds) {
  let id = isString(preferredId) && preferredId !== '' ? preferredId : createRandomId();

  while (usedIds.has(id)) {
    id = createRandomId();
  }
  usedIds.add(id);
  return id;
}

function createTeacher(user, usedIds) {
  const birthday = user.b_day ?? user.b_date ?? null;

  return {
    gender: isString(user.gender) ? capitalize(user.gender) : null,
    title: user.title ?? null,
    full_name: user.full_name ?? null,
    city: user.city ?? null,
    state: user.state ?? null,
    country: user.country ?? null,
    postcode: user.postcode ?? null,
    coordinates: user.coordinates ?? null,
    timezone: user.timezone ?? null,
    email: user.email ?? null,
    b_day: birthday,
    age: user.age ?? calculateAge(birthday),
    phone: user.phone ?? null,
    picture_large: user.picture_large ?? null,
    picture_thumbnail: user.picture_thumbnail ?? null,

    id: createUniqueId(user.id, usedIds),
    favorite: isBoolean(user.favorite) ? user.favorite : false,
    course: getNormalizedCourse(user.course) ?? sample(COURSES),
    bg_color: checkIsHexColor(user.bg_color) ? user.bg_color : createRandomHexColor(),
    note: isString(user.note) ? user.note : '',
  };
}

export function getFormattedUsers(...userLists) {
  const normalizedUsers = flatten(userLists).map(normalizeUserInterface);
  const uniqueUsers = removeDuplicates(normalizedUsers);
  const usedIds = new Set();

  return uniqueUsers.map((user) => createTeacher(user, usedIds));
}