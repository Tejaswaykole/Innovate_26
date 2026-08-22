import React from 'react';

interface HackathonStatusCardProps {
  status: string | null;
}

export const HackathonStatusCard: React.FC<HackathonStatusCardProps> = ({ status }) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 shadow-sm flex flex-col h-full">
      <div className="flex items-center mb-4">
        <span className="material-symbols-outlined text-primary mr-2" data-icon="flag">
          flag
        </span>
        <h3 className="font-title-md text-title-md text-on-surface">Hackathon Status</h3>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-surface-container border border-outline-variant/50 mb-3">
            <span className="font-label-lg text-label-lg text-on-surface-variant">
              {status || 'Status not configured'}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[200px] mx-auto">
            {!status && 'The global state machine for the hackathon is not yet active.'}
          </p>
        </div>
      </div>
    </div>
  );
};
