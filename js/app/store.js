import { filterUsers } from '../filter.js';
import { createSearchPredicate } from '../search.js';

let teachers = [];
let filters = {};
let searchQuery = '';
const listeners = new Set();




function notify(change = null) {
  listeners.forEach((listener) => listener(teachers, change));
}

function checkHasPhoto(teacher) {
  return Boolean(teacher.picture_large);
}





export function subscribe(listener) {
  listeners.add(listener);
}





export function getTeachers() {
  return teachers;
}

function selectVisibleTeachers(sourceTeachers) {
  const { withPhoto, ...userFilters } = filters;
  let visibleTeachers = filterUsers(sourceTeachers, userFilters);

  if (withPhoto) {
    visibleTeachers = visibleTeachers.filter(checkHasPhoto);
  }
  if (searchQuery !== '') {
    visibleTeachers = visibleTeachers.filter(createSearchPredicate(searchQuery));
  }
  return visibleTeachers;
}

export function getVisibleTeachers() {
  return selectVisibleTeachers(teachers);
}

export function checkIsTeacherVisible(teacher) {
  return selectVisibleTeachers([teacher]).length > 0;
}



export function findTeacherById(id) {
  return teachers.find((teacher) => teacher.id === id) ?? null;
}





export function setTeachers(nextTeachers) {
  teachers = nextTeachers;
  notify();
}




export function addTeacher(teacher) {
  teachers = [...teachers, teacher];
  notify({ type: 'add', teacher });
}




export function toggleFavorite(id) {
  setTeachers(
    teachers.map((teacher) => (teacher.id === id ? { ...teacher, favorite: !teacher.favorite } : teacher)),
  );
}

export function setFilters(nextFilters) {
  filters = nextFilters;
  notify();
}

export function setSearchQuery(nextSearchQuery) {
  if (nextSearchQuery === searchQuery) {
    return;
  }
  searchQuery = nextSearchQuery;
  notify();
}
