import { BrowserRouter } from 'react-router';

import { AuthProvider } from '@/features/auth';

import AppRoutes from './AppRoutes.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
