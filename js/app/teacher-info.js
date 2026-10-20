import { findTeacherById, subscribe, toggleFavorite } from './store.js';
import { createTeacherInfoHtml } from './templates.js';

const INFO_MODAL_HASH = '#info-modal';
const CLOSED_MODAL_HASH = '#!';

export function initTeacherInfo() {
  const page = document.querySelector('.container');
  const modal = document.getElementById('info-modal');
  const content = document.getElementById('teacher-info');
  let currentTeacherId = null;
  let isMapVisible = false;

  function render() {
    const teacher = findTeacherById(currentTeacherId);
    if (teacher) {
      content.innerHTML = createTeacherInfoHtml(teacher, { isMapVisible });
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
