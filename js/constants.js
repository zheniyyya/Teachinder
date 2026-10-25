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
  Australia: { pattern: /^\d{2}-\d{4}-\d{4}$/, example: '02-9876-5432' },
  Brazil: { pattern: /^\(\d{2}\) \d{4}-\d{4}$/, example: '(41) 9772-5677' },
  Canada: { pattern: /^([\dA-Z]\d{2} [\dA-Z]\d{2}|\d{3}-\d{3})-\d{4}$/, example: '416-555-1234' },
  Denmark: { pattern: /^\d{8}$/, example: '12345678' },
  Finland: { pattern: /^\d{2}-\d{3}-\d{3}$/, example: '04-123-456' },
  France: { pattern: /^\d{2}(-\d{2}){4}$/, example: '01-23-45-67-89' },
  Germany: { pattern: /^\d{4}-\d{7}$/, example: '0179-1899833' },
  India: { pattern: /^\d{10}$/, example: '9876543210' },
  Iran: { pattern: /^\d{3}-\d{8}$/, example: '021-12345678' },
  Ireland: { pattern: /^\d{3}-\d{3}-\d{4}$/, example: '071-558-2972' },
  Mexico: { pattern: /^\(\d{3}\) \d{3} \d{4}$/, example: '(644) 388 9381' },
  Netherlands: {
    pattern: /^(\(\d{3}\)-\d{3}-\d{4}|\(\d{3}\) \d{7}|\(\d{4}\) \d{6})$/,
    example: '(0570) 360697',
  },
  'New Zealand': { pattern: /^\(\d{3}\)-\d{3}-\d{4}$/, example: '(123)-456-7890' },
  Norway: { pattern: /^\d{8}$/, example: '12345678' },
  Serbia: { pattern: /^\d{3}-\d{4}-\d{3}$/, example: '011-3464-662' },
  Spain: { pattern: /^\d{3}-\d{3}-\d{3}$/, example: '912-345-678' },
  Switzerland: { pattern: /^\d{3} \d{3} \d{2} \d{2}$/, example: '079 875 60 36' },
  Turkey: { pattern: /^\(\d{3}\)-\d{3}-\d{4}$/, example: '(312)-345-6789' },
  Ukraine: {
    pattern: /^(\(0\d{2}\) [\dA-Z]\d{2}-\d{4}|\+380[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2})$/,
    example: '+380 96 185 12 68',
  },
  'United Kingdom': { pattern: /^0\d{2,6}( \d{3,6}){1,2}$/, example: '01539 601245' },
  'United States': { pattern: /^\(\d{3}\)[ -]\d{3}-\d{4}$/, example: '(421) 720-3260' },
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