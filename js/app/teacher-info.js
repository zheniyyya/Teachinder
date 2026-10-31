import { findTeacherById, subscribe, toggleFavorite } from './store.js';
import { createTeacherInfoHtml, getMapCoordinates } from './templates.js';

const INFO_MODAL_HASH = '#info-modal';
const CLOSED_MODAL_HASH = '#!';

const MAP_ZOOM = 5;
const MAP_TILES_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';



export function initTeacherInfo() {
  const page = document.querySelector('.container');
  const modal = document.getElementById('info-modal');
  const content = document.getElementById('teacher-info');
  let currentTeacherId = null;
  let isMapVisible = false;
  let map = null;





  function renderMap(teacher) {
    map?.remove();
    map = null;

    const container = content.querySelector('.teacher-map');
    if (!container) {
      return;
    }

    const { latitude, longitude } = getMapCoordinates(teacher);
    map = L.map(container).setView([latitude, longitude], MAP_ZOOM);
    L.tileLayer(MAP_TILES_URL, { attribution: MAP_ATTRIBUTION }).addTo(map);
    L.marker([latitude, longitude]).addTo(map);
  }




  function render() {
    const teacher = findTeacherById(currentTeacherId);
    if (teacher) {
      content.innerHTML = createTeacherInfoHtml(teacher, { isMapVisible });
      renderMap(teacher);
    }
  }




  page.addEventListener('click', (event) => {
    const card = event.target.closest('[data-teacher-id]');
    if (!card) {
      return;
    }
    currentTeacherId = card.dataset.teacherId;
    isMapVisible = false;
    render();
  });



  
  modal.addEventListener('click', (event) => {
    if (event.target.closest('.star-btn')) {
      toggleFavorite(currentTeacherId);
    }
    if (event.target.closest('.toggle-map')) {
      isMapVisible = !isMapVisible;
      render();
    }
  });

  subscribe(render);

  if (window.location.hash === INFO_MODAL_HASH) {
    window.location.hash = CLOSED_MODAL_HASH;
  }
}
