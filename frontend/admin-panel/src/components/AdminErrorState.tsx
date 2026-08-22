import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminErrorState: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleReturn = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest p-6">
      <div className="max-w-md w-full bg-surface-container-low rounded-xl p-8 text-center shadow-sm border border-outline-variant/30">
        <span className="material-symbols-outlined text-[64px] text-error mb-4" data-icon="gpp_bad">
          gpp_bad
        </span>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Access Denied</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          Unable to verify administrator access.
        </p>
        <button
          onClick={handleReturn}
          className="w-full bg-primary text-on-primary font-label-lg py-3 px-6 rounded-lg hover:bg-primary-fixed-variant transition-colors active:scale-[0.98]"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};
