import { additionalUsers, randomUserMock } from './data/FE4U-Lab2-mock.js';
import { SORT_ORDER } from './constants.js';
import { getFormattedUsers } from './format.js';
import { validateUser } from './validate.js';
import { filterUsers } from './filter.js';
import { sortUsers } from './sort.js';
import { findUser } from './search.js';
import { getMatchPercentage } from './percentage.js';

const TABLE_COLUMNS = ['full_name', 'gender', 'age', 'country', 'course', 'favorite'];
const PREVIEW_LIMIT = 5;

function printTitle(title) {
  const line = '='.repeat(70);
  console.log(`\n${line}\n${title}\n${line}`);
}

function printUsers(users, columns = TABLE_COLUMNS) {
  if (users.length === 0) {
    console.log('(nothing found)');
    return;
  }
  console.table(users, columns);
}

function getUserSummary(user) {
  if (user === null) {
    return 'null (not found)';
  }
  return `${user.full_name}, ${user.age}, ${user.country}; note: "${user.note}"`;
}

function runTask1() {
  printTitle('Task 1. Formatting and merging data');

  const users = getFormattedUsers(randomUserMock, additionalUsers);
  const sourceCount = randomUserMock.length + additionalUsers.length;

  console.log(`Input objects: ${sourceCount}, after merging without duplicates: ${users.length}`);
  console.log('\nExample of a formatted object (data from both arrays merged):');
  console.log(users[0]);

  console.log('\nTypes of added fields:');
  const { id, favorite, course, bg_color: bgColor, note } = users[0];
  console.log({
    id: typeof id,
    favorite: typeof favorite,
    course: typeof course,
    bg_color: typeof bgColor,
    note: typeof note,
  });

  return users;
}

function runTask2(users) {
  printTitle('Task 2. Validation');

  console.log(`validateUser("${users[0].full_name}"):`, validateUser(users[0]));

  const invalidUser = {
    full_name: 'john doe',
    gender: 'male',
    note: 'student',
    state: 'kyivska',
    city: 'kyiv',
    country: 'Ukraine',
    age: '25',
    phone: '12-34',
    email: 'john.doe.example.com',
  };
  console.log('\nIntentionally invalid object:', validateUser(invalidUser));

  const invalidUsers = users.filter((user) => !validateUser(user).isValid);
  console.log(`\nValid: ${users.length - invalidUsers.length} of ${users.length}. Invalid:`);

  for (const user of invalidUsers) {
    console.log(`- ${user.full_name}:`, validateUser(user).errors);
  }
}

function runTask3(users) {
  printTitle('Task 3. Filtering (logical AND)');

  const filterExamples = [
    { country: 'Germany' },
    { gender: 'female', age: { min: 40, max: 60 } },
    { country: 'United States', gender: 'male', age: '46+' },
    { favorite: true },
  ];

  for (const filters of filterExamples) {
    const result = filterUsers(users, filters);
    console.log(`\nfilterUsers(users, ${JSON.stringify(filters)}) → ${result.length} found`);
    printUsers(result);
  }
}

function runTask4(users) {
  printTitle('Task 4. Sorting (first 5 records)');

  const sortExamples = [
    ['full_name', SORT_ORDER.ASC],
    ['age', SORT_ORDER.DESC],
    ['b_day', SORT_ORDER.ASC],
    ['country', SORT_ORDER.DESC],
  ];

  for (const [field, order] of sortExamples) {
    console.log(`\nsortUsers(users, '${field}', '${order}')`);
    printUsers(sortUsers(users, field, order).slice(0, PREVIEW_LIMIT), ['full_name', 'age', 'b_day', 'country']);
  }

  try {
    sortUsers(users, 'email');
  } catch (error) {
    console.log(`\nError handled: ${error.message}`);
  }
}

function runTask5(users) {
  printTitle('Task 5. Search');

  const queries = ['Weishaupt', 'cats', 65, '28', 'Nobody'];

  for (const query of queries) {
    console.log(`findUser(users, ${JSON.stringify(query)}) → ${getUserSummary(findUser(users, query))}`);
  }
}

function runTask6(users) {
  printTitle('Task 6. Percentage of objects matching the search');

  const olderThan30 = getMatchPercentage(users, (user) => user.age > 30);
  console.log(`Age over 30: ${olderThan30}%`);
  console.log(`Female: ${getMatchPercentage(users, { gender: 'female' })}%`);
  console.log(`Norway + not favorite: ${getMatchPercentage(users, { country: 'Norway', favorite: false })}%`);
  console.log(`Search "an" (name or note): ${getMatchPercentage(users, 'an')}%`);

  const conditionExample = Array.from({ length: 50 }, (_, index) => ({ age: index < 30 ? 40 : 20 }));
  console.log(`Example from the task (30 of 50): ${getMatchPercentage(conditionExample, (user) => user.age > 30)}%`);
}

function main() {
  const users = runTask1();
  runTask2(users);
  runTask3(users);
  runTask4(users);
  runTask5(users);
  runTask6(users);
}

main();