import React from 'react';

export const AdminLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest">
      <div className="flex flex-col items-center space-y-md">
        <span className="material-symbols-outlined text-[48px] text-primary animate-pulse" data-icon="admin_panel_settings">
          admin_panel_settings
        </span>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Admin Portal</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Loading...</p>
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mt-4"></div>
      </div>
    </div>
  );
};
