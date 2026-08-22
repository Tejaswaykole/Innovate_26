import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest p-6">
      <div className="max-w-md w-full bg-surface-container-low rounded-xl p-8 text-center shadow-sm border border-outline-variant/30">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4" data-icon="search_off">
          search_off
        </span>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Page Not Found</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-primary text-on-primary font-label-lg py-3 px-6 rounded-lg hover:bg-primary-fixed-variant transition-colors active:scale-[0.98]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
