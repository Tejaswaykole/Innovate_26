import React from 'react';
import type { RecentActivityItem } from '../../services/adminDashboardService';

interface RecentActivityListProps {
  activity: RecentActivityItem[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activity }) => {
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'PARTICIPANT_REGISTERED': return { icon: 'person_add', color: 'text-primary', bg: 'bg-primary/10' };
      case 'JUDGE_REGISTERED': return { icon: 'gavel', color: 'text-tertiary', bg: 'bg-tertiary/10' };
      case 'TEAM_CREATED': return { icon: 'group_add', color: 'text-secondary', bg: 'bg-secondary/10' };
      case 'PROJECT_SUBMITTED': return { icon: 'publish', color: 'text-error', bg: 'bg-error/10' };
      case 'EVALUATION_COMPLETED': return { icon: 'fact_check', color: 'text-success', bg: 'bg-success/10' };
      default: return { icon: 'notifications', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' };
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
        <h3 className="font-title-md text-title-md text-on-surface flex items-center">
          <span className="material-symbols-outlined mr-2 text-on-surface-variant" data-icon="history">history</span>
          Recent Activity
        </h3>
      </div>
      
      {activity.length === 0 ? (
        <div className="p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2" data-icon="inbox">inbox</span>
          <p className="font-body-md text-body-md text-on-surface-variant">No recent activity yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-outline-variant/20">
          {activity.map((item) => {
            const style = getIcon(item.type);
            return (
              <li key={item.id} className="p-4 hover:bg-surface-container-lowest transition-colors flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}>
                  <span className={`material-symbols-outlined text-[20px] ${style.color}`} data-icon={style.icon}>
                    {style.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md text-on-surface truncate">{item.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">{item.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-caption text-caption text-on-surface-variant/70">{formatTime(item.timestamp)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
