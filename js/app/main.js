import { additionalUsers, randomUserMock } from '../data/FE4U-Lab2-mock.js';
import { getFormattedUsers } from '../format.js';
import { initAddTeacherForm } from './add-teacher.js';
import { initFavorites } from './favorites.js';
import { initStatistics } from './statistics.js';
import { setTeachers } from './store.js';
import { initTeacherInfo } from './teacher-info.js';
import { initTopTeachers } from './top-teachers.js';

function main() {
  setTeachers(getFormattedUsers(randomUserMock, additionalUsers));

  initTopTeachers();
  initTeacherInfo();
  initFavorites();
  initStatistics();
  initAddTeacherForm();
}

main();
