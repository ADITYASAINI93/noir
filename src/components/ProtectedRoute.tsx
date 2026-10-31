import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jet flex flex-col items-center justify-center text-purewhite">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan animate-spin" />
          <p className="font-display text-xs tracking-[0.3em] uppercase text-muted">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    // Redirect to login page preserving the intended location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};
