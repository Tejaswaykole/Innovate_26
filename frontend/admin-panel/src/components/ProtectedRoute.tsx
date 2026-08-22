import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Array<'participant' | 'judge' | 'admin'>;
  requireVerifiedEmail?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requireVerifiedEmail = false,
}) => {
  const { currentUser, role, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerifiedEmail && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  if (profile?.accountStatus === 'suspended') {
     return <div className="p-8 text-center text-red-500">Your account is suspended.</div>;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-red-600 mb-4">ACCESS DENIED</h1>
        <p className="text-gray-600 mb-8">You do not have permission to access this area.</p>
        <button onClick={() => window.history.back()} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  return <Outlet />;
};
