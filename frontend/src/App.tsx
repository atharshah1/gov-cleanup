import type { ReactElement } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { dashboardPathForRole } from './lib/navigation';
import { DashboardLayout } from './layouts/DashboardLayout';
import type { UserRole } from './lib/types';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { FeatureModulesPage } from './pages/FeatureModulesPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/user/UserDashboard';
import { useSessionStore } from './store/session';

function RequireAuth() {
  const location = useLocation();
  const user = useSessionStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function RequireRole({ role, children }: { role: UserRole; children: ReactElement }) {
  const user = useSessionStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return children;
}

function DashboardIndexRedirect() {
  const user = useSessionStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={dashboardPathForRole(user.role)} replace />;
}

function LegacyRegisterRedirect() {
  const { role } = useParams();
  return <Navigate to={role ? `/signup/${role}` : '/signup'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/login/citizen" replace />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/signup" element={<Navigate to="/signup/citizen" replace />} />
      <Route path="/signup/:role" element={<RegisterPage />} />
      <Route path="/register" element={<LegacyRegisterRedirect />} />
      <Route path="/register/:role" element={<LegacyRegisterRedirect />} />

      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardIndexRedirect />} />
          <Route path="user" element={<RequireRole role="citizen"><UserDashboard /></RequireRole>} />
          <Route path="driver" element={<RequireRole role="driver"><DriverDashboard /></RequireRole>} />
          <Route path="admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        </Route>
        <Route path="/features" element={<DashboardLayout />}>
          <Route index element={<FeatureModulesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
