import { filterUsers } from '../filter.js';
import { getSortedUniqueValues } from '../helpers.js';
import { createSearchPredicate } from '../search.js';
import { fillSelect } from './dom.js';
import { getTeachers, subscribe } from './store.js';
import { createEmptyMessageHtml, createTeacherCardHtml } from './templates.js';

function readFilters(form) {
  const { country, age, gender, favorite } = form.elements;

  return {
    country: country.value,
    age: age.value,
    gender: gender.value,
    favorite: favorite.checked || undefined,
  };
}

function checkHasPhoto(teacher) {
  return Boolean(teacher.picture_large);
}

function selectVisibleTeachers(teachers, filtersForm, searchQuery) {
  let visibleTeachers = filterUsers(teachers, readFilters(filtersForm));

  if (filtersForm.elements.photo.checked) {
    visibleTeachers = visibleTeachers.filter(checkHasPhoto);
  }
  if (searchQuery !== '') {
    visibleTeachers = visibleTeachers.filter(createSearchPredicate(searchQuery));
  }
  return visibleTeachers;
}

export function initTopTeachers() {
  const grid = document.getElementById('teachers-grid');
  const filtersForm = document.getElementById('teachers-filters');
  const searchForm = document.getElementById('search-form');
  let searchQuery = '';

  function renderGrid() {
    const teachers = selectVisibleTeachers(getTeachers(), filtersForm, searchQuery);

    grid.innerHTML =
      teachers.length > 0
        ? teachers.map(createTeacherCardHtml).join('')
        : createEmptyMessageHtml('No teachers found');
  }

  function renderCountryOptions() {
    const countries = getSortedUniqueValues(getTeachers().map((teacher) => teacher.country));
    fillSelect(filtersForm.elements.country, countries);
  }

  function render() {
    renderCountryOptions();
    renderGrid();
  }

  filtersForm.addEventListener('change', renderGrid);

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchQuery = searchForm.elements.q.value.trim();
    filtersForm.reset();
    renderGrid();
  });

  searchForm.elements.q.addEventListener('input', () => {
    if (searchQuery !== '' && searchForm.elements.q.value.trim() === '') {
      searchQuery = '';
      renderGrid();
    }
  });

  subscribe(render);
  render();
}
