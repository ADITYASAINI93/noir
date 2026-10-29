import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AccountPage } from './pages/AccountPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Public Experience Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Public Guest Registration */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Guest Sign In */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />

          {/* Guest Sign Up */}
          <Route path="/signup" element={<SignUpPage />} />

          {/* Password Recovery & Reset */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Authenticated Guest Profile & Passes */}
          <Route path="/account" element={<AccountPage />} />

          {/* Administrator Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Private Administrator Dashboard (Guarded by Supabase Auth & Admin Verification) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
