import { getSortedUniqueValues } from '../helpers.js';
import { fillSelect } from './dom.js';
import { checkIsTeacherVisible, getTeachers, getVisibleTeachers, setFilters, setSearchQuery, subscribe } from './store.js';
import { createEmptyMessageHtml, createTeacherCardHtml } from './templates.js';

function readFilters(form) {
  const { country, age, gender, favorite, photo } = form.elements;

  return {
    country: country.value,
    age: age.value,
    gender: gender.value,
    favorite: favorite.checked || undefined,
    withPhoto: photo.checked,
  };
}





export function initTopTeachers() {
  const grid = document.getElementById('teachers-grid');
  const filtersForm = document.getElementById('teachers-filters');
  const searchForm = document.getElementById('search-form');
  const searchInput = searchForm.elements.q;




  function renderGrid() {
    const teachers = getVisibleTeachers();

    if (teachers.length > 0) {
      grid.innerHTML = teachers.map(createTeacherCardHtml).join('');
    } else {
      grid.innerHTML = getTeachers().length > 0 ? createEmptyMessageHtml('No teachers found') : '';
    }
  }




  function renderCountryOptions() {
    const countries = getSortedUniqueValues(getTeachers().map((teacher) => teacher.country));
    fillSelect(filtersForm.elements.country, countries);
  }


  function appendTeacherCard(teacher) {
    if (!checkIsTeacherVisible(teacher)) {
      return;
    }
    if (grid.querySelector('.empty-message')) {
      grid.innerHTML = '';
    }
    grid.insertAdjacentHTML('beforeend', createTeacherCardHtml(teacher));
  }


  function render(teachers, change) {
    renderCountryOptions();
    if (change?.type === 'add') {
      appendTeacherCard(change.teacher);
    } else {
      renderGrid();
    }
  }


  


  filtersForm.addEventListener('change', () => {
    setFilters(readFilters(filtersForm));
  });



  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    filtersForm.reset();
    setFilters(readFilters(filtersForm));
    setSearchQuery(searchInput.value.trim());
  });


  

  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      setSearchQuery('');
    }
  });

  subscribe(render);
  render();
}
