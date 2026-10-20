import { COURSES } from './constants.js';

import {
  calculateAge,
  capitalize,
  checkIsHexColor,
  compareIgnoreCase,
  createRandomHexColor,
  createRandomId,
  getRandomItem,
} from './helpers.js';

function getIdFromRandomUser(rawId) {
  const value = rawId?.value;
  if (!value || /NaN|undefined/.test(value)) {
    return null;
  }
  return `${rawId.name}${value}`;
}

function checkIsRandomUserInterface(user) {
  return typeof user.name === 'object' && user.name !== null;
}

function formatRandomUser(user) {
  const { name = {}, location = {}, dob = {}, picture = {} } = user;

  return {
    gender: user.gender,
    title: name.title,
    full_name: [name.first, name.last].filter(Boolean).join(' '),
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
  const merged = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value !== null && value !== undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

function removeDuplicates(users) {
  const uniqueUsers = [];

  for (const user of users) {
    const duplicateIndex = uniqueUsers.findIndex((uniqueUser) => checkIsSameUser(uniqueUser, user));

    if (duplicateIndex === -1) {
      uniqueUsers.push(user);
    } else {
      uniqueUsers[duplicateIndex] = mergeUsers(uniqueUsers[duplicateIndex], user);
    }
  }
  return uniqueUsers;
}

function getNormalizedCourse(course) {
  if (typeof course !== 'string') {
    return null;
  }
  return COURSES.find((item) => compareIgnoreCase(item, course)) ?? null;
}

function createUniqueId(preferredId, usedIds) {
  let id = typeof preferredId === 'string' && preferredId !== '' ? preferredId : createRandomId();

  while (usedIds.has(id)) {
    id = createRandomId();
  }
  usedIds.add(id);
  return id;
}

function createTeacher(user, usedIds) {
  const birthday = user.b_day ?? user.b_date ?? null;

  return {
    gender: capitalize(user.gender) ?? null,
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
    favorite: typeof user.favorite === 'boolean' ? user.favorite : false,
    course: getNormalizedCourse(user.course) ?? getRandomItem(COURSES),
    bg_color: checkIsHexColor(user.bg_color) ? user.bg_color : createRandomHexColor(),
    note: typeof user.note === 'string' ? user.note : '',
  };
}

export function getFormattedUsers(...userLists) {
  const normalizedUsers = userLists.flat().map(normalizeUserInterface);
  const uniqueUsers = removeDuplicates(normalizedUsers);
  const usedIds = new Set();

  return uniqueUsers.map((user) => createTeacher(user, usedIds));
}