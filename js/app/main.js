import { initAddTeacherForm } from './add-teacher.js';
import { initFavorites } from './favorites.js';
import { initStatistics } from './statistics.js';
import { initTeacherInfo } from './teacher-info.js';
import { initTeachersLoader } from './teachers-loader.js';
import { initTopTeachers } from './top-teachers.js';

function main() {
  initTopTeachers();
  initTeacherInfo();
  initFavorites();
  initStatistics();
  initAddTeacherForm();
  initTeachersLoader();
}

main();
