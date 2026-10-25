import { saveTeacher } from '../api.js';
import { COURSES, PHONE_FORMATS } from '../constants.js';
import { checkIsSameUser, getFormattedUsers } from '../format.js';
import { capitalize, getSortedUniqueValues } from '../helpers.js';
import { validateUser } from '../validate.js';
import { escapeHtml, fillSelect } from './dom.js';
import { addTeacher, getTeachers, subscribe } from './store.js';

const CLOSED_MODAL_HASH = '#!';

const MIN_TEACHER_AGE = 18;

const FORM_CONTROLS = Object.freeze({
  full_name: 'name',
  country: 'country',
  city: 'city',
  email: 'email',
  phone: 'phone',
  age: 'birth',
  gender: 'sex',
  note: 'notes',
});

const FORM_ERROR_MESSAGES = Object.freeze({
  age: `enter a valid date of birth (the teacher must be at least ${MIN_TEACHER_AGE})`,
  gender: 'choose the sex',
});

const REQUIRED_FIELD_MESSAGE = 'this field is required';
const DUPLICATE_TEACHER_MESSAGE = 'a teacher with this email has already been added';





function checkIsEmpty(value) {
  return value === null || value === undefined || value === '';
}

function checkIsAlreadyAdded(teacher) {
  return getTeachers().some((existingTeacher) => checkIsSameUser(existingTeacher, teacher));
}






function readTeacher(form) {
  const data = new FormData(form);
  const getText = (name) => (data.get(name) ?? '').trim();

  return {
    full_name: getText('name'),
    course: data.get('speciality'),
    country: data.get('country'),
    city: getText('city'),
    email: getText('email'),
    phone: getText('phone'),
    b_day: data.get('birth') || null,
    gender: data.get('sex'),
    bg_color: data.get('color'),
    note: getText('notes'),
  };
}





function getFormErrors(teacher) {
  const { errors } = validateUser(teacher);

  if (!errors.age && teacher.age < MIN_TEACHER_AGE) {
    errors.age = FORM_ERROR_MESSAGES.age;
  }
  if (!errors.email && checkIsAlreadyAdded(teacher)) {
    errors.email = DUPLICATE_TEACHER_MESSAGE;
  }

  return Object.entries(errors)
    .filter(([field]) => field in FORM_CONTROLS)
    .map(([field, message]) => ({
      controlName: FORM_CONTROLS[field],
      message: capitalize(
        FORM_ERROR_MESSAGES[field] ?? (checkIsEmpty(teacher[field]) ? REQUIRED_FIELD_MESSAGE : message),
      ),
    }));
}





function renderErrors(form, errors) {
  form.querySelectorAll('.form-error').forEach((error) => error.remove());

  for (const { controlName, message } of errors) {
    const formGroup = form.querySelector(`[name="${controlName}"]`).closest('.form-group');
    formGroup.insertAdjacentHTML('beforeend', `<p class="form-error">${escapeHtml(message)}</p>`);
  }
}

function renderSubmitError(form, message) {
  const footer = form.querySelector('.modal-footer');
  footer.insertAdjacentHTML('afterbegin', `<p class="form-error" role="alert">${escapeHtml(message)}</p>`);
}

function renderPhonePlaceholder(form, defaultPlaceholder) {
  const { country, phone } = form.elements;
  phone.placeholder = PHONE_FORMATS[country.value]?.example ?? defaultPlaceholder;
}






function renderOptions(form) {
  const countries = [...getTeachers().map((teacher) => teacher.country), ...Object.keys(PHONE_FORMATS)];

  fillSelect(form.elements.speciality, COURSES);
  fillSelect(form.elements.country, getSortedUniqueValues(countries));
}




export function initAddTeacherForm() {
  const form = document.getElementById('add-teacher-form');
  const submitButton = form.querySelector('[type="submit"]');
  const defaultPhonePlaceholder = form.elements.phone.placeholder;

  renderOptions(form);

  form.addEventListener('input', (event) => {
    event.target.closest('.form-group')?.querySelector('.form-error')?.remove();
  });

  form.elements.country.addEventListener('change', () => {
    renderPhonePlaceholder(form, defaultPhonePlaceholder);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const [teacher] = getFormattedUsers([readTeacher(form)]);
    const errors = getFormErrors(teacher);
    renderErrors(form, errors);

    if (errors.length > 0) {
      return;
    }

    submitButton.disabled = true;
    try {
      addTeacher(await saveTeacher(teacher));
      form.reset();
      renderPhonePlaceholder(form, defaultPhonePlaceholder);
      window.location.hash = CLOSED_MODAL_HASH;
    } catch (error) {
      renderSubmitError(form, `Could not save the teacher: ${error.message}`);
    } finally {
      submitButton.disabled = false;
    }
  });

  subscribe(() => renderOptions(form));
}
