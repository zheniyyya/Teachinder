import { getDaysUntilBirthday, getInitials, getReadableTextColor } from '../helpers.js';
import { escapeHtml } from './dom.js';




function joinFilled(values, separator = ', ') {
  return values.filter((value) => value !== null && value !== undefined && value !== '').join(separator);
}




function createInitialsHtml(teacher, className) {
  const style = `background-color: ${teacher.bg_color}; color: ${getReadableTextColor(teacher.bg_color)}`;
  return `<div class="${className}" style="${style}">${escapeHtml(getInitials(teacher.full_name))}</div>`;
}




function createAvatarHtml(teacher, { showStar }) {
  const hasStar = showStar && teacher.favorite;
  const picture = teacher.picture_large
    ? `<img src="${escapeHtml(teacher.picture_large)}" alt="${escapeHtml(teacher.full_name)}">`
    : createInitialsHtml(teacher, 'teacher-initials');

  return `
    <div class="teacher-avatar${hasStar ? ' teacher-avatar--star' : ''}">
      ${picture}
      ${hasStar ? '<span class="star" aria-label="Favorite">★</span>' : ''}
    </div>`;
}





function createNameHtml(fullName) {
  const [firstName, ...lastNames] = (fullName ?? '').split(' ');
  return [firstName, lastNames.join(' ')].filter(Boolean).map(escapeHtml).join('<br>');
}




export function createEmptyMessageHtml(text) {
  return `<p class="empty-message">${escapeHtml(text)}</p>`;
}





export function createTeacherCardHtml(teacher) {
  return `
    <a class="teacher-card" href="#info-modal" data-teacher-id="${escapeHtml(teacher.id)}">
      ${createAvatarHtml(teacher, { showStar: true })}
      <div class="teacher-name">${createNameHtml(teacher.full_name)}</div>
      <div class="teacher-subject">${escapeHtml(teacher.course)}</div>
      <div class="teacher-country">${escapeHtml(teacher.country)}</div>
    </a>`;
}





export function createFavoriteCardHtml(teacher) {
  return `
    <a class="teacher-card" href="#info-modal" data-teacher-id="${escapeHtml(teacher.id)}">
      ${createAvatarHtml(teacher, { showStar: false })}
      <div class="teacher-name">${createNameHtml(teacher.full_name)}</div>
      <div class="teacher-country">${escapeHtml(teacher.country)}</div>
    </a>`;
}





function createBirthdayHtml(birthDate) {
  const daysLeft = getDaysUntilBirthday(birthDate);
  if (daysLeft === null) {
    return '';
  }
  return `<div class="meta">${daysLeft === 0 ? 'Birthday is today' : `Days until next birthday: ${daysLeft}`}</div>`;
}




export function getMapCoordinates(teacher) {
  const latitude = Number(teacher.coordinates?.latitude);
  const longitude = Number(teacher.coordinates?.longitude);
  const isValid =
    Number.isFinite(latitude) && Math.abs(latitude) <= 90 && Number.isFinite(longitude) && Math.abs(longitude) <= 180;

  return isValid ? { latitude, longitude } : null;
}





function createMapHtml(teacher, isMapVisible) {
  const coordinates = getMapCoordinates(teacher);
  if (!coordinates) {
    return '';
  }

  return `
    <button class="toggle-map" type="button" aria-expanded="${isMapVisible}">toggle map</button>
    ${isMapVisible ? `<div class="teacher-map" role="region" aria-label="${escapeHtml(teacher.full_name)} on the map"></div>` : ''}`;
}






export function createTeacherInfoHtml(teacher, { isMapVisible = false } = {}) {
  const photo = teacher.picture_large
    ? `<img class="teacher-info-photo" src="${escapeHtml(teacher.picture_large)}" alt="${escapeHtml(teacher.full_name)}">`
    : createInitialsHtml(teacher, 'teacher-info-photo teacher-info-photo--initials');
  const starLabel = teacher.favorite ? 'Remove from favorites' : 'Add to favorites';

  return `
    <div class="teacher-info clearfix">
      ${photo}

      <div class="teacher-info-details">
        <button class="star-btn" type="button" aria-label="${starLabel}" aria-pressed="${teacher.favorite}">
          ${teacher.favorite ? '★' : '☆'}
        </button>

        <h3>${escapeHtml(teacher.full_name)}</h3>
        <div class="subject">${escapeHtml(teacher.course)}</div>
        <div class="meta">${escapeHtml(joinFilled([teacher.city, teacher.country]))}</div>
        <div class="meta">${escapeHtml(joinFilled([teacher.age, teacher.gender]))}</div>
        <div class="meta"><a href="mailto:${escapeHtml(teacher.email)}">${escapeHtml(teacher.email)}</a></div>
        <div class="meta">${escapeHtml(teacher.phone)}</div>
        ${createBirthdayHtml(teacher.b_day)}
      </div>
    </div>

    ${teacher.note ? `<p class="teacher-info-bio">${escapeHtml(teacher.note)}</p>` : ''}

    ${createMapHtml(teacher, isMapVisible)}`;
}
