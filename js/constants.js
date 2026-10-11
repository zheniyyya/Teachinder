export const COURSES = Object.freeze([
  'Mathematics',
  'Physics',
  'English',
  'Computer Science',
  'Dancing',
  'Chess',
  'Biology',
  'Chemistry',
  'Law',
  'Art',
  'Medicine',
  'Statistics',
]);

export const CAPITALIZED_FIELDS = Object.freeze([
  'full_name',
  'gender',
  'note',
  'state',
  'city',
  'country',
]);

export const OPTIONAL_FIELDS = Object.freeze(['note']);

export const PHONE_FORMATS = Object.freeze({
  Australia: /^\d{2}-\d{4}-\d{4}$/,
  Canada: /^\d{3}-\d{3}-\d{4}$/,
  Denmark: /^\d{8}$/,
  Finland: /^\d{2}-\d{3}-\d{3}$/,
  France: /^\d{2}(-\d{2}){4}$/,
  Germany: /^\d{4}-\d{7}$/,
  Iran: /^\d{3}-\d{8}$/,
  Ireland: /^\d{3}-\d{3}-\d{4}$/,
  Netherlands: /^\(\d{3}\)-\d{3}-\d{4}$/,
  'New Zealand': /^\(\d{3}\)-\d{3}-\d{4}$/,
  Norway: /^\d{8}$/,
  Spain: /^\d{3}-\d{3}-\d{3}$/,
  Switzerland: /^\d{3} \d{3} \d{2} \d{2}$/,
  Turkey: /^\(\d{3}\)-\d{3}-\d{4}$/,
  Ukraine: /^\+380[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
  'United States': /^\(\d{3}\)-\d{3}-\d{4}$/,
});

export const DEFAULT_PHONE_FORMAT = /^\+?[\d\s()-]+$/;
export const MIN_PHONE_DIGITS = 7;
export const MAX_PHONE_DIGITS = 15;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FILTERABLE_FIELDS = Object.freeze(['country', 'age', 'gender', 'favorite']);

export const SORTABLE_FIELDS = Object.freeze(['full_name', 'age', 'b_day', 'country']);

export const SORT_ORDER = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});