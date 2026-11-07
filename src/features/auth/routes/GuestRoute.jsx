import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/shared/config/routes.js';

import { useAuth } from '../hooks/useAuth.js';

export default function GuestRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to={location.state?.from?.pathname ?? ROUTES.dashboard} replace />;
  }
  return <Outlet />;
}
