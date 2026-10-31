import { fetchRandomUsers, fetchSavedTeachers } from '../api.js';
import { getFormattedUsers } from '../format.js';
import { createRandomId } from '../helpers.js';
import { validateUser } from '../validate.js';
import { getTeachers, setTeachers } from './store.js';

const INITIAL_TEACHERS_COUNT = 50;
const NEXT_TEACHERS_COUNT = 10;





function selectValidTeachers(users) {
  return getFormattedUsers(users).filter((teacher) => {
    const { isValid, errors } = validateUser(teacher);

    if (!isValid) {
      console.warn(`Teacher "${teacher.full_name}" is skipped because of invalid data:`, errors);
    }
    return isValid;
  });
}






function addTeachers(teachers) {
  const previousCount = getTeachers().length;
  setTeachers(getFormattedUsers(getTeachers(), teachers));
  return getTeachers().length - previousCount;
}




function getPageNumber(requestedCount, pageSize) {
  return requestedCount / pageSize + 1;
}




async function loadSavedTeachers() {
  try {
    addTeachers(await fetchSavedTeachers());
  } catch (error) {
    console.info(`Saved teachers are not loaded: ${error.message}`);
  }
}




export function initTeachersLoader() {
  const nextButton = document.getElementById('next-teachers');
  const status = document.getElementById('teachers-status');
  const seed = createRandomId();
  let requestedCount = 0;

  function renderStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('load-status--error', isError);
  }


  async function loadRandomTeachers(count) {
    const isFirstRequest = requestedCount === 0;
    nextButton.disabled = true;
    renderStatus('Loading teachers…');


    try {
      const users = await fetchRandomUsers({ results: count, page: getPageNumber(requestedCount, count), seed });
      requestedCount += count;

      const addedCount = addTeachers(selectValidTeachers(users));
      renderStatus(isFirstRequest ? '' : `${addedCount} more teachers loaded, ${getTeachers().length} in total`);
    } catch (error) {
      renderStatus(`Could not load teachers: ${error.message}`, true);
    } finally {
      nextButton.disabled = false;
      nextButton.textContent = requestedCount === 0 ? 'Try again' : `Next ${NEXT_TEACHERS_COUNT} teachers`;
    }
  }


  nextButton.addEventListener('click', () => {
    loadRandomTeachers(requestedCount === 0 ? INITIAL_TEACHERS_COUNT : NEXT_TEACHERS_COUNT);
  });

  loadRandomTeachers(INITIAL_TEACHERS_COUNT);
  loadSavedTeachers();
}
