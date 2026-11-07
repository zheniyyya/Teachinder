import { useCallback, useMemo, useState } from 'react';

import { deleteCookie, readCookie, writeCookie } from '@/shared/lib/cookies.js';

import { AUTH_COOKIE_NAME, REMEMBER_ME_MAX_AGE_S } from '../constants.js';
import { checkCredentials, checkIsKnownUser, normalizeLogin } from '../lib/credentials.js';
import { AuthContext } from './AuthContext.js';

function readStoredUser() {
  const storedUser = readCookie(AUTH_COOKIE_NAME);
  return checkIsKnownUser(storedUser) ? storedUser : null;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const signIn = useCallback(({ login, password, remember }) => {
    if (!checkCredentials({ login, password })) {
      return false;
    }

    const username = normalizeLogin(login);
    writeCookie(AUTH_COOKIE_NAME, username, { maxAge: remember ? REMEMBER_ME_MAX_AGE_S : undefined });
    setUser(username);
    return true;
  }, []);

  const signOut = useCallback(() => {
    deleteCookie(AUTH_COOKIE_NAME);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
