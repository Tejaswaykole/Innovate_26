import React from 'react';
import type { AdminDashboardStats } from '../../services/adminDashboardService';

interface StatisticsGridProps {
  stats: AdminDashboardStats;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Participants',
      value: stats.participants,
      icon: 'groups',
      subtext: 'Registered users',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Teams',
      value: stats.teams,
      icon: 'workspaces',
      subtext: 'Formed teams',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Judges',
      value: stats.judges,
      icon: 'gavel',
      subtext: 'Assigned judges',
      color: 'text-tertiary',
      bg: 'bg-tertiary/10',
    },
    {
      label: 'Submissions',
      value: stats.submissions,
      icon: 'file_present',
      subtext: 'Submitted projects',
      color: 'text-error',
      bg: 'bg-error/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1">{card.label}</p>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">{card.value}</h3>
            <p className="font-caption text-caption text-on-surface-variant mt-1">{card.subtext}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bg}`}>
            <span className={`material-symbols-outlined text-[28px] ${card.color}`} data-icon={card.icon}>
              {card.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
