import { countBy, mapKeys, orderBy, pick, toPairs } from 'lodash-es';
import { SORT_ORDER } from '../constants.js';
import { sortUsers } from '../sort.js';
import { getTeachers, getVisibleTeachers, subscribe } from './store.js';




const STATISTICS_VIEWS = Object.freeze({
  CHART: 'chart',
  COUNTRIES: 'countries',
  FLAT: 'flat',
});





const COLUMN_CAPTIONS = Object.freeze({
  full_name: 'Name',
  course: 'Speciality',
  age: 'Age',
  b_day: 'Birthday',
  gender: 'Gender',
  country: 'Nationality',
  city: 'City',
  email: 'Email',
  phone: 'Phone',
});

const COLUMN_TYPES = Object.freeze({
  age: 'number',
  b_day: 'date string',
});




// The first object of the WebDataRocks data describes the types of the columns
const PIVOT_META_OBJECT = Object.freeze(
  Object.fromEntries(
    Object.entries(COLUMN_CAPTIONS).map(([field, caption]) => [caption, { type: COLUMN_TYPES[field] ?? 'string' }]),
  ),
);

const PIVOT_DATE_PATTERN = 'dd/MM/yyyy';





function getChartGroups(teachers, field) {
  return orderBy(toPairs(countBy(teachers, field)), [1, 0], [SORT_ORDER.DESC, SORT_ORDER.ASC]);
}

function getChartColors(count) {
  return Array.from({ length: count }, (_, index) => `hsl(${Math.round((index * 360) / count)}, 65%, 55%)`);
}





function createPivotData(teachers) {
  const records = sortUsers(teachers, 'full_name').map((teacher) =>
    mapKeys(pick(teacher, Object.keys(COLUMN_CAPTIONS)), (value, field) => COLUMN_CAPTIONS[field]),
  );
  return [PIVOT_META_OBJECT, ...records];
}





function createPivotSlice(view) {
  if (view === STATISTICS_VIEWS.FLAT) {
    const captions = Object.values(COLUMN_CAPTIONS);
    return {
      rows: captions.map((caption) => ({ uniqueName: caption })),
      flatOrder: captions,
    };
  }

  return {
    rows: [{ uniqueName: COLUMN_CAPTIONS.country }],
    columns: [{ uniqueName: 'Measures' }],
    measures: [
      { uniqueName: COLUMN_CAPTIONS.full_name, aggregation: 'count', caption: 'Teachers' },
      { uniqueName: COLUMN_CAPTIONS.age, aggregation: 'average', caption: 'Average age', format: 'average' },
    ],
  };
}

function createPivotReport(view, teachers) {
  return {
    dataSource: { data: createPivotData(teachers) },
    slice: createPivotSlice(view),
    options: {
      grid: { type: view === STATISTICS_VIEWS.FLAT ? 'flat' : 'compact', showGrandTotals: 'off' },
      datePattern: PIVOT_DATE_PATTERN,
      showAggregationLabels: false,
    },
    formats: [{ name: 'average', decimalPlaces: 1 }],
  };
}





export function initStatistics() {
  const views = document.getElementById('statistics-views');
  const chartView = document.getElementById('statistics-chart-view');
  const groupSelect = document.getElementById('chart-group');
  const pivotContainer = document.getElementById('statistics-pivot');
  const chart = new Chart(document.getElementById('statistics-chart'), {
    type: 'pie',
    data: { labels: [], datasets: [{ label: 'Teachers', data: [] }] },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } },
    },
  });
  let currentView = STATISTICS_VIEWS.CHART;
  let pivot = null;




  function renderChart() {
    const groups = getChartGroups(getVisibleTeachers(), groupSelect.value);
    const [dataset] = chart.data.datasets;

    chart.data.labels = groups.map(([label]) => label);
    dataset.data = groups.map(([, count]) => count);
    dataset.backgroundColor = getChartColors(groups.length);
    chart.update();
  }





  function renderPivot() {
    const report = createPivotReport(currentView, getTeachers());

    if (pivot) {
      pivot.setReport(report);
    } else {
      pivot = new WebDataRocks({ container: `#${pivotContainer.id}`, toolbar: false, report });
    }
  }





  function renderView() {
    const isChartView = currentView === STATISTICS_VIEWS.CHART;

    views.querySelectorAll('[data-view]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.view === currentView));
    });
    chartView.hidden = !isChartView;
    pivotContainer.hidden = isChartView;

    if (isChartView) {
      renderChart();
    } else {
      renderPivot();
    }
  }





  function render() {
    if (currentView === STATISTICS_VIEWS.CHART) {
      renderChart();
    } else {
      pivot.updateData({ data: createPivotData(getTeachers()) });
    }
  }




  views.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view]');
    if (!button || button.dataset.view === currentView) {
      return;
    }
    currentView = button.dataset.view;
    renderView();
  });

  groupSelect.addEventListener('change', renderChart);

  subscribe(render);
  renderView();
}
