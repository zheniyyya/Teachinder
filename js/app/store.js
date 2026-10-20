let teachers = [];
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener(teachers));
}

export function subscribe(listener) {
  listeners.add(listener);
}

export function getTeachers() {
  return teachers;
}

export function findTeacherById(id) {
  return teachers.find((teacher) => teacher.id === id) ?? null;
}

export function setTeachers(nextTeachers) {
  teachers = nextTeachers;
  notify();
}

export function addTeacher(teacher) {
  setTeachers([...teachers, teacher]);
}

export function toggleFavorite(id) {
  setTeachers(
    teachers.map((teacher) => (teacher.id === id ? { ...teacher, favorite: !teacher.favorite } : teacher)),
  );
}
