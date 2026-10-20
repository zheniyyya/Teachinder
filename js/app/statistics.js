import { SORT_ORDER } from '../constants.js';
import { sortUsers } from '../sort.js';
import { getTeachers, subscribe } from './store.js';
import { createPaginationHtml, createStatisticsRowHtml } from './templates.js';

const ROWS_PER_PAGE = 10;

const ARIA_SORT = Object.freeze({
  [SORT_ORDER.ASC]: 'ascending',
  [SORT_ORDER.DESC]: 'descending',
});

function sortByCourse(teachers, order) {
  const direction = order === SORT_ORDER.ASC ? 1 : -1;
  return [...teachers].sort((first, second) => direction * first.course.localeCompare(second.course));
}

function sortTeachers(teachers, { field, order }) {
  return field === 'course' ? sortByCourse(teachers, order) : sortUsers(teachers, field, order);
}

function getNextSorting(sorting, field) {
  const isSameAscending = sorting.field === field && sorting.order === SORT_ORDER.ASC;
  return { field, order: isSameAscending ? SORT_ORDER.DESC : SORT_ORDER.ASC };
}

export function initStatistics() {
  const table = document.getElementById('statistics-table');
  const pagination = document.getElementById('statistics-pagination');
  const sortableHeaders = table.querySelectorAll('th[data-sort]');
  let sorting = { field: 'full_name', order: SORT_ORDER.ASC };
  let currentPage = 1;

  function renderSortIndicators() {
    sortableHeaders.forEach((header) => {
      const isSorted = header.dataset.sort === sorting.field;
      header.setAttribute('aria-sort', isSorted ? ARIA_SORT[sorting.order] : 'none');
    });
  }

  function render() {
    const teachers = sortTeachers(getTeachers(), sorting);
    const pageCount = Math.max(Math.ceil(teachers.length / ROWS_PER_PAGE), 1);
    currentPage = Math.min(currentPage, pageCount);

    const pageStart = (currentPage - 1) * ROWS_PER_PAGE;
    const pageTeachers = teachers.slice(pageStart, pageStart + ROWS_PER_PAGE);

    table.tBodies[0].innerHTML = pageTeachers.map(createStatisticsRowHtml).join('');
    pagination.innerHTML = createPaginationHtml(pageCount, currentPage);
    renderSortIndicators();
  }

  table.tHead.addEventListener('click', (event) => {
    const header = event.target.closest('th[data-sort]');
    if (!header) {
      return;
    }
    sorting = getNextSorting(sorting, header.dataset.sort);
    currentPage = 1;
    render();
  });

  pagination.addEventListener('click', (event) => {
    const pageLink = event.target.closest('[data-page]');
    if (!pageLink) {
      return;
    }
    event.preventDefault();
    currentPage = Number(pageLink.dataset.page);
    render();
  });

  subscribe(render);
  render();
}
