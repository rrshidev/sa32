import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import GaragePage from '../pages/garage/GaragePage';
import ServiceManagementPage from '../pages/service-management/ServiceManagementPage';
import CreateServicePage from '../pages/services/CreateServicePage';
import { useAuth } from '../contexts/AuthContext';
import ServiceListPage from '../pages/services/ServiceListPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Защищенные маршруты */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
            <ServiceListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/garage"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
            <GaragePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-management"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
            <ServiceManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/new"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login">
            <CreateServicePage />
          </ProtectedRoute>
        }
      />

      {/* Перенаправление для неизвестных маршрутов */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
