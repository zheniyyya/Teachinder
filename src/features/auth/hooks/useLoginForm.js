import { useState } from 'react';

import { validateLoginForm } from '../lib/validation.js';
import { useAuth } from './useAuth.js';

const INITIAL_VALUES = Object.freeze({ login: '', password: '', remember: false });

const VALIDATED_FIELDS = Object.freeze(['login', 'password']);

const ALL_FIELDS_TOUCHED = Object.freeze({ login: true, password: true });

const AUTH_ERROR_MESSAGE = 'Incorrect login or password. Please try again.';

export function useLoginForm() {
  const { signIn } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [authError, setAuthError] = useState('');

  const errors = validateLoginForm(values);

  function getFieldError(field) {
    return touched[field] ? errors[field] : '';
  }

  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setAuthError('');
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTouched(ALL_FIELDS_TOUCHED);

    const invalidField = VALIDATED_FIELDS.find((field) => errors[field]);
    if (invalidField) {
      event.currentTarget.elements[invalidField].focus();
      return;
    }

    if (!signIn(values)) {
      setAuthError(AUTH_ERROR_MESSAGE);
    }
  }

  return { values, authError, getFieldError, handleChange, handleBlur, handleSubmit };
}
