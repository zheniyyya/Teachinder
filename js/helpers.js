import dayjs from 'dayjs';

export function createRandomHexColor() {
  const randomNumber = Math.floor(Math.random() * 0x1000000);
  return `#${randomNumber.toString(16).padStart(6, '0')}`;
}

export function createRandomId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function checkIsHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

export function checkIsPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function capitalize(value) {
  if (typeof value !== 'string' || value === '') {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1);
}

export function checkStartsWithCapital(value) {
  if (typeof value !== 'string') {
    return false;
  }
  const [firstChar] = value;
  if (firstChar === undefined || !/\p{L}/u.test(firstChar)) {
    return false;
  }
  return firstChar === firstChar.toUpperCase();
}

export function compareIgnoreCase(first, second) {
  if (typeof first !== 'string' || typeof second !== 'string') {
    return false;
  }
  return first.trim().toLowerCase() === second.trim().toLowerCase();
}

export function checkIncludesIgnoreCase(text, part) {
  if (typeof text !== 'string') {
    return false;
  }
  return text.toLowerCase().includes(part.toLowerCase());
}

export function calculateAge(birthDate, today = new Date()) {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }
  return age;
}

export function roundTo(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function getInitials(fullName) {
  if (typeof fullName !== 'string') {
    return '';
  }
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('.');
}

export function getReadableTextColor(hexColor) {
  if (!checkIsHexColor(hexColor)) {
    return '#ffffff';
  }
  const [red, green, blue] = [1, 3, 5].map((start) => parseInt(hexColor.slice(start, start + 2), 16));
  const brightness = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return brightness > 0.6 ? '#2c3e50' : '#ffffff';
}

export function getDaysUntilBirthday(birthDate, today = dayjs()) {
  if (!birthDate) {
    return null;
  }

  // Only the date part is used, so the time zone of the ISO string does not shift the day
  const birth = dayjs(String(birthDate).slice(0, 10));
  if (!birth.isValid()) {
    return null;
  }

  const startOfToday = today.startOf('day');
  let nextBirthday = birth.year(startOfToday.year());

  if (nextBirthday.isBefore(startOfToday)) {
    nextBirthday = nextBirthday.add(1, 'year');
  }
  return nextBirthday.diff(startOfToday, 'day');
}

export function getSortedUniqueValues(values) {
  const uniqueValues = new Set(values.filter((value) => typeof value === 'string' && value !== ''));
  return [...uniqueValues].sort((first, second) => first.localeCompare(second));
}