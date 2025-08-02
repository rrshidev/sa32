import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({ isAllowed, redirectTo, children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAllowed) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;