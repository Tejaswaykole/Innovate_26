import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions } from '../services/adminSubmissionService';
import type { AdminSubmission } from '../services/adminSubmissionService';

export const AdminSubmissionsHackathonosPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'DRAFT' | 'SUBMITTED'>('All');
  const [judgingFilter, setJudgingFilter] = useState<'All' | 'Awaiting Judges' | 'Judging In Progress' | 'Judging Complete'>('All');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        sub.teamName.toLowerCase().includes(searchLower) ||
        sub.teamCode.toLowerCase().includes(searchLower) ||
        sub.projectTitle.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter !== 'All' && sub.status !== statusFilter) return false;

      // Judging Filter
      if (judgingFilter !== 'All' && sub.judgingSummary.judgingStatus !== judgingFilter) return false;

      return true;
    });
  }, [submissions, searchTerm, statusFilter, judgingFilter]);

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-on-surface-variant flex flex-col items-center gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-lg">Loading Submissions...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full pb-20">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">folder_special</span>
            Submission Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Read-only view of all team submissions and their global judging progress.
          </p>
        </div>
        <button 
          onClick={fetchData} 
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center gap-2"
          title="Refresh Data"
        >
          <span className="material-symbols-outlined">refresh</span>
          <span className="sr-only">Refresh</span>
        </button>
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

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Search team, code, or project..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-full font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Submission Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {(['All', 'SUBMITTED', 'DRAFT'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-full font-label-sm whitespace-nowrap transition-colors border ${
                  statusFilter === f 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-low'
                }`}
              >
                {f === 'All' ? 'All Statuses' : f}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px bg-outline-variant/50 my-1"></div>

          {/* Judging Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {(['All', 'Awaiting Judges', 'Judging In Progress', 'Judging Complete'] as const).map(f => (
              <button
                key={f}
                onClick={() => setJudgingFilter(f)}
                className={`px-4 py-1.5 rounded-full font-label-sm whitespace-nowrap transition-colors border ${
                  judgingFilter === f 
                    ? 'bg-secondary text-on-secondary border-secondary' 
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-low'
                }`}
              >
                {f === 'All' ? 'All Judging' : f}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Submissions Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-label-md">
              <th className="p-4 pl-6">Team & Project</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4">Submitted At</th>
              <th className="p-4">Judging Progress</th>
              <th className="p-4">Avg Score</th>
              <th className="p-4">Judging Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-on-surface divide-y divide-outline-variant/20">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-[48px] opacity-50">search_off</span>
                    <p>No submissions match your criteria.</p>
                    {(searchTerm || statusFilter !== 'All' || judgingFilter !== 'All') && (
                      <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('All'); setJudgingFilter('All'); }}
                        className="text-primary hover:underline font-label-md mt-2"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubmissions.map(sub => (
                <tr key={sub.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="font-label-lg">{sub.projectTitle}</div>
                    <div className="text-on-surface-variant text-sm flex items-center gap-2 mt-1">
                      <span>{sub.teamName}</span>
                      <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">{sub.teamCode}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      sub.status === 'SUBMITTED' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">
                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="p-4">
                    {sub.status === 'SUBMITTED' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-success font-bold font-mono">{sub.judgingSummary.completedEvaluations}</span>
                        <span className="text-outline-variant">/</span>
                        <span className="text-on-surface-variant font-mono">{sub.judgingSummary.totalJudges}</span>
                      </div>
                    ) : (
                      <span className="text-outline-variant">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {sub.status === 'SUBMITTED' && sub.judgingSummary.completedEvaluations > 0 ? (
                      <span className="font-bold font-mono text-primary bg-primary/5 px-2 py-1 rounded">{sub.judgingSummary.averageScore}</span>
                    ) : (
                      <span className="text-outline-variant">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {sub.status === 'SUBMITTED' ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className={`material-symbols-outlined text-[16px] ${
                          sub.judgingSummary.judgingStatus === 'Judging Complete' ? 'text-success' :
                          sub.judgingSummary.judgingStatus === 'Judging In Progress' ? 'text-primary animate-pulse' :
                          'text-on-surface-variant'
                        }`}>
                          {sub.judgingSummary.judgingStatus === 'Judging Complete' ? 'check_circle' :
                           sub.judgingSummary.judgingStatus === 'Judging In Progress' ? 'donut_large' :
                           'schedule'}
                        </span>
                        <span className={`font-medium ${
                          sub.judgingSummary.judgingStatus === 'Judging Complete' ? 'text-success' :
                          sub.judgingSummary.judgingStatus === 'Judging In Progress' ? 'text-primary' :
                          'text-on-surface-variant'
                        }`}>
                          {sub.judgingSummary.judgingStatus}
                        </span>
                      </div>
                    ) : (
                      <span className="text-outline-variant">—</span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Link 
                      to={`/submissions/${sub.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors font-label-sm"
                    >
                      Inspect
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-center">
        <span className="inline-block px-3 py-1 bg-surface-container rounded-full text-xs text-on-surface-variant font-label-md flex items-center gap-2 w-fit mx-auto">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Submissions are read-only to preserve hackathon integrity.
        </span>
      </div>

    </div>
  );
};
