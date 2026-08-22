import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getEvaluations, getEvaluationSummary } from '../services/adminEvaluationService';
import type { AdminEvaluation, AdminEvaluationSummary } from '../services/adminEvaluationService';

export const AdminEvaluationsHackathonosPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<AdminEvaluation[]>([]);
  const [summary, setSummary] = useState<AdminEvaluationSummary | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'DRAFT' | 'SUBMITTED'>('All');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [evalsData, summaryData] = await Promise.all([
        getEvaluations(),
        getEvaluationSummary()
      ]);
      setEvaluations(evalsData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Failed to load evaluations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(ev => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        ev.teamName.toLowerCase().includes(searchLower) ||
        ev.teamCode.toLowerCase().includes(searchLower) ||
        ev.projectTitle.toLowerCase().includes(searchLower) ||
        ev.judgeName.toLowerCase().includes(searchLower) ||
        ev.judgeEmail.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
      if (statusFilter !== 'All' && ev.status !== statusFilter) return false;

      return true;
    });
  }, [evaluations, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-on-surface-variant flex flex-col items-center gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-lg">Loading Judging Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full pb-20">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">monitoring</span>
            Evaluation Monitoring
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Read-only control center for all judge evaluations and global progress.
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

      {/* Judging Control Center */}
      {summary && (
        <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-title-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">dashboard</span>
              JUDGING CONTROL CENTER
            </h2>
            
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${
              summary.expectedEvaluations > 0 && summary.completedEvaluations === summary.expectedEvaluations
                ? 'bg-success/10 text-success border-success/20'
                : summary.expectedEvaluations === 0 
                  ? 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                  : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {summary.expectedEvaluations > 0 && summary.completedEvaluations === summary.expectedEvaluations
                ? 'Judging Complete'
                : summary.expectedEvaluations === 0
                  ? 'Waiting For Submissions'
                  : 'Judging In Progress'
              }
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
              <div className="text-xs text-on-surface-variant mb-1">Total Judges</div>
              <div className="font-headline-md text-on-surface">{summary.totalJudges}</div>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
              <div className="text-xs text-on-surface-variant mb-1">Submitted Teams</div>
              <div className="font-headline-md text-on-surface">{summary.eligibleTeams}</div>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
              <div className="text-xs text-on-surface-variant mb-1">Expected Evals</div>
              <div className="font-headline-md text-on-surface">{summary.expectedEvaluations}</div>
            </div>
            <div className="bg-success/5 p-4 rounded-xl border border-success/30 text-center">
              <div className="text-xs text-success mb-1">Completed</div>
              <div className="font-headline-md text-success">{summary.completedEvaluations}</div>
            </div>
             <div className="bg-error/5 p-4 rounded-xl border border-error/30 text-center">
              <div className="text-xs text-error mb-1">Pending</div>
              <div className="font-headline-md text-error">{summary.pendingEvaluations}</div>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/30 text-center">
              <div className="text-xs text-primary mb-1">Progress</div>
              <div className="font-headline-md text-primary font-mono">{summary.progress}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Judge Progress */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4">
               <h3 className="font-label-md text-on-surface-variant mb-3 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">person</span>
                 Judge Progress
               </h3>
               <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {summary.judgeProgress.length === 0 ? (
                   <div className="text-sm text-outline-variant italic">No active judges.</div>
                 ) : (
                   summary.judgeProgress.map(jp => (
                     <div key={jp.judgeUid} className="flex justify-between items-center text-sm">
                       <span className="font-medium text-on-surface truncate pr-4">{jp.judgeName}</span>
                       <span className="font-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant flex-shrink-0">
                         {jp.completed} / {jp.expected}
                       </span>
                     </div>
                   ))
                 )}
               </div>
            </div>

            {/* Team Judging Progress */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4">
               <h3 className="font-label-md text-on-surface-variant mb-3 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">groups</span>
                 Team Judging Progress
               </h3>
               <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {summary.teamProgress.length === 0 ? (
                   <div className="text-sm text-outline-variant italic">No submitted teams.</div>
                 ) : (
                   summary.teamProgress.map(tp => (
                     <div key={tp.teamId} className="flex justify-between items-center text-sm">
                       <span className="font-medium text-on-surface truncate pr-4">{tp.teamName}</span>
                       <span className="font-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant flex-shrink-0">
                         {tp.completed} / {tp.expected}
                       </span>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Search Judge, Team, or Project..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-full font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full lg:w-auto">
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
              {f === 'All' ? 'All Evaluations' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-label-md">
              <th className="p-4 pl-6">Judge</th>
              <th className="p-4">Team & Project</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4">Score</th>
              <th className="p-4">Submitted At</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-on-surface divide-y divide-outline-variant/20">
            {filteredEvaluations.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-[48px] opacity-50">search_off</span>
                    <p>{evaluations.length === 0 ? 'No evaluations found.' : 'No evaluations match your filters.'}</p>
                    {(searchTerm || statusFilter !== 'All') && (
                      <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                        className="text-primary hover:underline font-label-md mt-2"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvaluations.map(ev => (
                <tr key={ev.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="font-label-lg">{ev.judgeName}</div>
                    <div className="text-on-surface-variant text-sm mt-1">{ev.judgeEmail}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-label-lg">{ev.projectTitle}</div>
                    <div className="text-on-surface-variant text-sm flex items-center gap-2 mt-1">
                      <span>{ev.teamName}</span>
                      <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">{ev.teamCode}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      ev.status === 'SUBMITTED' ? 'bg-success/10 text-success' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {ev.status === 'SUBMITTED' ? (
                      <span className="font-bold font-mono text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/20 text-lg">
                        {ev.totalScore}
                      </span>
                    ) : (
                      <span className="text-outline-variant">—</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">
                    {ev.submittedAt ? new Date(ev.submittedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Link 
                      to={`/evaluations/${ev.id}`}
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
    </div>
  );
};
