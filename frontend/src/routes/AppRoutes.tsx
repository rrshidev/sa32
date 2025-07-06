import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashBoardPage';
import AppointmentsPage from '../pages/appointments/AppointmentsPage';
import CreateAppointmentPage from '../pages/appointments/CreateAppointmentPage';
import GaragePage from '../pages/garage/GaragePage';
import ServicesPage from '../pages/services/ServicesPage';
import ProfilePage from '../pages/ProfilePage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/appointments"
        element={isAuthenticated ? <AppointmentsPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/appointments/new"
        element={isAuthenticated ? <CreateAppointmentPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/garage"
        element={isAuthenticated ? <GaragePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/services"
        element={isAuthenticated ? <ServicesPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;