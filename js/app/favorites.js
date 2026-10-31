import { getTeachers, subscribe } from './store.js';
import { createEmptyMessageHtml, createFavoriteCardHtml } from './templates.js';





const VISIBLE_FAVORITES_BY_MEDIA = Object.freeze([
  ['(max-width: 480px)', 2],
  ['(max-width: 767px)', 3],
]);





const DEFAULT_VISIBLE_FAVORITES = 5;






function getVisibleFavoritesCount() {
  const match = VISIBLE_FAVORITES_BY_MEDIA.find(([query]) => window.matchMedia(query).matches);
  return match ? match[1] : DEFAULT_VISIBLE_FAVORITES;
}






export function initFavorites() {
  const carousel = document.getElementById('favorites-carousel');
  const list = document.getElementById('favorites-list');
  const [previousButton, nextButton] = carousel.querySelectorAll('[data-step]');
  let firstIndex = 0;




  function render() {
    const favorites = getTeachers().filter((teacher) => teacher.favorite);
    const visibleCount = getVisibleFavoritesCount();
    const lastFirstIndex = Math.max(favorites.length - visibleCount, 0);
    firstIndex = Math.min(Math.max(firstIndex, 0), lastFirstIndex);

    list.innerHTML =
      favorites.length > 0
        ? favorites.slice(firstIndex, firstIndex + visibleCount).map(createFavoriteCardHtml).join('')
        : createEmptyMessageHtml('No favorite teachers yet');

    previousButton.disabled = firstIndex === 0;
    nextButton.disabled = firstIndex === lastFirstIndex;
  }


  
  carousel.addEventListener('click', (event) => {
    const arrow = event.target.closest('[data-step]');
    if (!arrow) {
      return;
    }
    firstIndex += Number(arrow.dataset.step);
    render();
  });

  VISIBLE_FAVORITES_BY_MEDIA.forEach(([query]) => {
    window.matchMedia(query).addEventListener('change', render);
  });

  subscribe(render);
  render();
}
