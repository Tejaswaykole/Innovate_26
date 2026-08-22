import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLoadingState } from './AdminLoadingState';
import { AdminErrorState } from './AdminErrorState';

const AdminProtectedRoute: React.FC = () => {
  const { currentUser, role, profile, loading } = useAuth();

  if (loading) {
    return <AdminLoadingState />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || role !== 'admin') {
    return <AdminErrorState />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
