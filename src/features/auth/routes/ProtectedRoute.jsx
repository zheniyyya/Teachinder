import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/shared/config/routes.js';

import { useAuth } from '../hooks/useAuth.js';

export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
