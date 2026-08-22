import React from 'react';

interface JudgingProgressCardProps {
  completed: number;
  pending: number;
}

export const JudgingProgressCard: React.FC<JudgingProgressCardProps> = ({ completed, pending }) => {
  const expected = completed + pending;
  const progress = expected === 0 ? 0 : Math.round((completed / expected) * 100);

  return (
    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="material-symbols-outlined text-tertiary mr-2" data-icon="data_usage">
            data_usage
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">Judging Progress</h3>
        </div>
        <span className="font-label-lg text-label-lg text-tertiary">{progress}%</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full bg-surface-container-highest rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="bg-tertiary h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-center">
          <div>
            <p className="font-headline-sm text-headline-sm text-on-surface">{completed}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Completed</p>
          </div>
          <div>
            <p className="font-headline-sm text-headline-sm text-on-surface">{pending}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Pending</p>
          </div>
          <div>
            <p className="font-headline-sm text-headline-sm text-on-surface">{expected}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Expected</p>
          </div>
        </div>
      </div>
    </div>
  );
};
