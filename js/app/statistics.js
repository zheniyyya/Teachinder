import { SORT_ORDER } from '../constants.js';
import { getMatchPercentage } from '../percentage.js';
import { sortUsers } from '../sort.js';
import { checkIsValidAge } from '../validate.js';
import { getTeachers, getVisibleTeachers, subscribe } from './store.js';
import {
  createEmptyRowHtml,
  createPaginationHtml,
  createStatisticsRowHtml,
  createStatisticsSummaryHtml,
} from './templates.js';

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

function getAverageAge(teachers) {
  const ages = teachers.map((teacher) => teacher.age).filter(checkIsValidAge);
  return ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : null;
}

function getSummaryItems(visibleTeachers, totalCount) {
  const malePercentage = getMatchPercentage(visibleTeachers, { gender: 'male' });
  const femalePercentage = getMatchPercentage(visibleTeachers, { gender: 'female' });
  const countriesCount = new Set(visibleTeachers.map((teacher) => teacher.country)).size;

  return [
    { label: 'Teachers shown', value: `${visibleTeachers.length} of ${totalCount}` },
    { label: 'Male / Female', value: `${malePercentage}% / ${femalePercentage}%` },
    { label: 'Average age', value: getAverageAge(visibleTeachers) ?? '—' },
    { label: 'Countries', value: countriesCount },
  ];
}

export function initStatistics() {
  const summary = document.getElementById('statistics-summary');
  const table = document.getElementById('statistics-table');
  const pagination = document.getElementById('statistics-pagination');
  const sortableHeaders = table.querySelectorAll('th[data-sort]');
  const columnsCount = table.tHead.rows[0].cells.length;
  let sorting = { field: 'full_name', order: SORT_ORDER.ASC };
  let currentPage = 1;

  function renderSortIndicators() {
    sortableHeaders.forEach((header) => {
      const isSorted = header.dataset.sort === sorting.field;
      header.setAttribute('aria-sort', isSorted ? ARIA_SORT[sorting.order] : 'none');
    });
  }

  function renderSummary(visibleTeachers) {
    const totalCount = getTeachers().length;

    summary.hidden = totalCount === 0;
    summary.innerHTML = createStatisticsSummaryHtml(getSummaryItems(visibleTeachers, totalCount));
  }

  function renderRows(pageTeachers) {
    const tableBody = table.tBodies[0];

    if (pageTeachers.length > 0) {
      tableBody.innerHTML = pageTeachers.map(createStatisticsRowHtml).join('');
    } else {
      tableBody.innerHTML = getTeachers().length > 0 ? createEmptyRowHtml('No teachers found', columnsCount) : '';
    }
  }

  function render() {
    const visibleTeachers = getVisibleTeachers();
    const teachers = sortTeachers(visibleTeachers, sorting);
    const pageCount = Math.max(Math.ceil(teachers.length / ROWS_PER_PAGE), 1);
    currentPage = Math.min(currentPage, pageCount);

    const pageStart = (currentPage - 1) * ROWS_PER_PAGE;
    const pageTeachers = teachers.slice(pageStart, pageStart + ROWS_PER_PAGE);

    renderSummary(visibleTeachers);
    renderRows(pageTeachers);
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
