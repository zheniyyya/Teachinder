import { Navigate, Route, Routes } from 'react-router';

import { GuestRoute, ProtectedRoute } from '@/features/auth';
import AppLayout from '@/layouts/AppLayout/AppLayout.jsx';
import DashboardPage from '@/pages/DashboardPage/DashboardPage.jsx';
import LoginPage from '@/pages/LoginPage/LoginPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage.jsx';
import { ROUTES } from '@/shared/config/routes.js';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<Navigate to={ROUTES.dashboard} replace />} />

      <Route element={<GuestRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
