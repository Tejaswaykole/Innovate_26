import React, { useState, useEffect } from 'react';
import { getAnalyticsOverview, downloadAnalyticsExport } from '../services/adminAnalyticsService';
import type { AdminAnalyticsData } from '../services/adminAnalyticsService';

export const AdminAnalyticsHackathonosPage: React.FC = () => {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultData = await getAnalyticsOverview();
      setData(resultData);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async (type: string) => {
    try {
      setExporting(type);
      await downloadAnalyticsExport(type);
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExporting(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 text-center animate-pulse text-on-surface-variant flex flex-col items-center gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-lg">Loading Analytics Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">analytics</span>
            Analytics & Reports
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Real-time insights and data exports for platform activity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={fetchData} 
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center border border-outline-variant/30 shadow-sm"
            title="Refresh Data"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg mb-8 font-body-md flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <div>
            <p>{error}</p>
            <button onClick={fetchData} className="text-sm underline mt-1">Retry</button>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          
          {/* User & Team Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Users Card */}
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-title-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                  User Analytics
                </h2>
                <div className="font-headline-sm text-on-surface">{data.users.total}</div>
              </div>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <div className="flex justify-between"><span>Participants</span><span className="font-medium text-on-surface">{data.users.participants}</span></div>
                <div className="flex justify-between"><span>Judges</span><span className="font-medium text-on-surface">{data.users.judges}</span></div>
                <div className="flex justify-between"><span>Admins</span><span className="font-medium text-on-surface">{data.users.admins}</span></div>
                <div className="flex justify-between text-error/80 pt-2 border-t border-outline-variant/20"><span>Disabled</span><span className="font-medium text-error">{data.users.disabledUsers}</span></div>
              </div>
            </div>

            {/* Teams Card */}
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-title-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">groups</span>
                  Team Analytics
                </h2>
                <div className="font-headline-sm text-on-surface">{data.teams.total}</div>
              </div>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <div className="flex justify-between"><span>With Submissions</span><span className="font-medium text-on-surface">{data.teams.withSubmissions}</span></div>
                <div className="flex justify-between"><span>No Submissions</span><span className="font-medium text-on-surface">{data.teams.withoutSubmissions}</span></div>
              </div>
            </div>

            {/* Submissions Card */}
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-title-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">file_present</span>
                  Submissions
                </h2>
                <div className="font-headline-sm text-on-surface">{data.submissions.total}</div>
              </div>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <div className="flex justify-between"><span>Submitted</span><span className="font-medium text-success">{data.submissions.submitted}</span></div>
                <div className="flex justify-between"><span>Draft</span><span className="font-medium text-on-surface">{data.submissions.draft}</span></div>
                <div className="flex justify-between pt-2 border-t border-outline-variant/20">
                  <span>Submission Rate</span>
                  <span className="font-medium text-on-surface">
                    {data.teams.total > 0 ? Math.round((data.submissions.submitted / data.teams.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-title-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">emoji_events</span>
                  Result Analytics
                </h2>
                <div className="font-headline-sm text-on-surface">{data.results.rankedTeams}</div>
              </div>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`font-medium ${data.results.isPublished ? 'text-success' : 'text-on-surface'}`}>
                    {data.results.isPublished ? 'Published' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between"><span>Highest Score</span><span className="font-medium text-on-surface font-mono">{data.results.highestScore !== null ? data.results.highestScore.toFixed(2) : '—'}</span></div>
                <div className="flex justify-between"><span>Lowest Score</span><span className="font-medium text-on-surface font-mono">{data.results.lowestScore !== null ? data.results.lowestScore.toFixed(2) : '—'}</span></div>
                <div className="flex justify-between pt-2 border-t border-outline-variant/20"><span>Average Score</span><span className="font-medium text-on-surface font-mono">{data.results.averageTeamScore !== null ? data.results.averageTeamScore.toFixed(2) : '—'}</span></div>
              </div>
            </div>

          </div>

          {/* Judging Progress Section */}
          <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
            <h2 className="font-title-lg text-on-surface flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-[24px]">fact_check</span>
              Judging Progress Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-3">
                <div className="mb-2 flex justify-between items-end">
                  <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Evaluation Completion</span>
                  <span className="font-headline-sm text-primary font-mono">{data.evaluations.completionPercentage}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-4 mb-4 overflow-hidden shadow-inner">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      data.evaluations.completionPercentage === 100 ? 'bg-success' : 'bg-primary'
                    }`} 
                    style={{ width: `${data.evaluations.completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-on-surface-variant italic">
                  {data.evaluations.completed} of {data.evaluations.expected} expected evaluations completed.
                </p>
              </div>

              <div className="col-span-1 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-outline-variant/30 pt-4 md:pt-0 md:pl-6">
                <div className="text-center md:text-left">
                  <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Status</div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    data.evaluations.expected > 0 && data.evaluations.completed === data.evaluations.expected
                      ? 'bg-success/10 text-success'
                      : data.evaluations.expected === 0
                        ? 'bg-surface-container-high text-on-surface-variant'
                        : 'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {data.evaluations.expected > 0 && data.evaluations.completed === data.evaluations.expected ? 'check_circle' : 'hourglass_empty'}
                    </span>
                    {data.evaluations.expected > 0 && data.evaluations.completed === data.evaluations.expected
                      ? 'Judging Complete'
                      : data.evaluations.expected === 0
                        ? 'Waiting For Submissions'
                        : 'Judging In Progress'
                    }
                  </div>
                </div>
                <div className="text-center md:text-left text-sm">
                  <span className="font-bold text-error">{data.evaluations.pending}</span> pending
                </div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
            <h2 className="font-title-lg text-on-surface flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[24px]">download</span>
              Report Exports (CSV)
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">
              Download raw aggregated data. Note: Exports do not contain sensitive authentication information.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {[
                { type: 'users', label: 'Users', icon: 'person' },
                { type: 'teams', label: 'Teams', icon: 'groups' },
                { type: 'submissions', label: 'Submissions', icon: 'file_present' },
                { type: 'evaluations', label: 'Evaluations', icon: 'fact_check' },
                { type: 'results', label: 'Official Results', icon: 'emoji_events' }
              ].map(exp => (
                <button
                  key={exp.type}
                  onClick={() => handleExport(exp.type)}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl hover:bg-surface-container-high hover:border-outline transition-all disabled:opacity-50 text-sm font-label-lg"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">{exp.icon}</span>
                  {exporting === exp.type ? 'Exporting...' : exp.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
