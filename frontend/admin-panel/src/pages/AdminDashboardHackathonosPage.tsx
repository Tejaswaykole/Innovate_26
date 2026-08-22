import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/adminDashboardService';
import type { AdminDashboardStats } from '../services/adminDashboardService';
import { StatisticsGrid } from '../components/dashboard/StatisticsGrid';
import { HackathonStatusCard } from '../components/dashboard/HackathonStatusCard';
import { JudgingProgressCard } from '../components/dashboard/JudgingProgressCard';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';

export const AdminDashboardHackathonosPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      if (err.message === 'Access Denied') {
        setError('Access Denied. You do not have permission to view this data.');
      } else {
        setError('Unable to load dashboard data.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="bg-error/10 rounded-xl p-8 border border-error/20 text-center flex flex-col items-center justify-center min-h-[400px]">
          <span className="material-symbols-outlined text-[48px] text-error mb-4" data-icon="error">
            error
          </span>
          <h2 className="font-headline-sm text-headline-sm text-error mb-2">{error}</h2>
          <button
            onClick={fetchStats}
            className="mt-6 bg-error text-on-error font-label-lg py-2 px-6 rounded-lg hover:bg-error/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-surface-container-high rounded w-48"></div>
          <div className="h-10 bg-surface-container-high rounded w-24"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 h-28 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-surface-container-high rounded w-20"></div>
                <div className="h-8 bg-surface-container-high rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-surface-container-high rounded-lg"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-surface-container-low rounded-xl h-[400px] border border-outline-variant/30"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-surface-container-low rounded-xl h-48 border border-outline-variant/30"></div>
            <div className="bg-surface-container-low rounded-xl h-48 border border-outline-variant/30"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Admin Overview</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Live metrics from the Hackathon Platform.</p>
        </div>
        <button
          onClick={fetchStats}
          aria-label="Refresh Dashboard"
          className="flex items-center justify-center py-2 px-4 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg font-label-md transition-colors self-start sm:self-auto border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[20px] mr-2" data-icon="refresh">
            refresh
          </span>
          Refresh
        </button>
      </div>

      <StatisticsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityList activity={stats.recentActivity} />
        </div>
        <div className="space-y-6 flex flex-col">
          <div className="flex-1">
            <HackathonStatusCard status={stats.hackathonStatus} />
          </div>
          <div className="flex-1">
            <JudgingProgressCard completed={stats.evaluationsCompleted} pending={stats.evaluationsPending} />
          </div>
        </div>
      </div>
    </div>
  );
};
