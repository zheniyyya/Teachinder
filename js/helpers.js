

export function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}



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