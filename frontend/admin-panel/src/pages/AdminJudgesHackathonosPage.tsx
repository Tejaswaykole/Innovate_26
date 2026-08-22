import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getJudges, getJudgingSummary, updateJudgeStatus, updateJudgeRole } from '../services/adminJudgeService';
import type { JudgeData, JudgingSummary } from '../services/adminJudgeService';

export const AdminJudgesHackathonosPage: React.FC = () => {
  const [judges, setJudges] = useState<JudgeData[]>([]);
  const [summary, setSummary] = useState<JudgingSummary | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Disabled' | 'Completed' | 'InProgress' | 'NotStarted'>('All');

  // Confirmation state for disabling/role change
  const [confirmAction, setConfirmAction] = useState<{ type: 'disable' | 'enable' | 'demote', judge: JudgeData } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [judgesData, summaryData] = await Promise.all([
        getJudges(),
        getJudgingSummary()
      ]);
      setJudges(judgesData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Failed to load judging data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJudges = useMemo(() => {
    return judges.filter(judge => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        judge.name.toLowerCase().includes(searchLower) || 
        judge.email.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Filter
      switch (filter) {
        case 'Active': return judge.status !== 'disabled';
        case 'Disabled': return judge.status === 'disabled';
        case 'Completed': return judge.progress === 100;
        case 'InProgress': return judge.progress > 0 && judge.progress < 100;
        case 'NotStarted': return judge.progress === 0;
        default: return true;
      }
    });
  }, [judges, searchTerm, filter]);

  const executeAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'disable') {
        await updateJudgeStatus(confirmAction.judge.uid, 'disabled');
      } else if (confirmAction.type === 'enable') {
        await updateJudgeStatus(confirmAction.judge.uid, 'active');
      } else if (confirmAction.type === 'demote') {
        await updateJudgeRole(confirmAction.judge.uid, 'participant');
      }
      setConfirmAction(null);
      fetchData(); // Refresh all data
    } catch (err: any) {
      alert(err.message || 'Failed to perform action.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-on-surface-variant flex flex-col items-center gap-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-label-lg">Loading Judging Infrastructure...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-container-max mx-auto w-full pb-20">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">gavel</span>
            Judge Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Monitor global judging progress. Every eligible submitted team is automatically available to all active Judges. 
            No manual assignments required.
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

      {/* Aggregate Summary Box */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-on-surface-variant font-label-sm mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">groups</span>
              Active Judges
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface">
              {summary.activeJudges} <span className="text-sm font-normal text-on-surface-variant ml-1">/ {summary.totalJudges}</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-on-surface-variant font-label-sm mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Eligible Teams
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface">{summary.eligibleTeams}</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-on-surface-variant font-label-sm mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
              Expected Evals
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface">{summary.expectedEvaluations}</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-on-surface-variant font-label-sm mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-success">check_circle</span>
              Completed
            </div>
            <div className="font-headline-sm text-headline-sm text-success">{summary.completedEvaluations}</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-on-surface-variant font-label-sm mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-error">pending_actions</span>
              Pending
            </div>
            <div className="font-headline-sm text-headline-sm text-error">{summary.pendingEvaluations}</div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="text-on-surface-variant font-label-sm mb-2 z-10 relative">Overall Progress</div>
            <div className="font-headline-sm text-headline-sm text-primary z-10 relative">{summary.progress}%</div>
            
            {/* Progress Background Bar */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-primary/20 w-full"></div>
            <div 
              className="absolute bottom-0 left-0 h-1.5 bg-primary transition-all duration-1000"
              style={{ width: `${summary.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Global Status Message */}
      {summary && (
        <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 font-label-lg ${
          summary.expectedEvaluations > 0 && summary.progress === 100 
            ? 'bg-success/10 border-success/30 text-success' 
            : summary.expectedEvaluations === 0 
              ? 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
              : 'bg-primary-container border-primary/20 text-on-primary-container'
        }`}>
          <span className="material-symbols-outlined">
            {summary.expectedEvaluations > 0 && summary.progress === 100 ? 'done_all' : summary.expectedEvaluations === 0 ? 'info' : 'donut_large'}
          </span>
          {summary.expectedEvaluations === 0 
            ? 'No submitted teams available for judging yet.' 
            : summary.progress === 100 
              ? 'Judging Complete! All eligible teams have been evaluated by all active judges.'
              : 'Judging In Progress.'
          }
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Search judges by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-full font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {(['All', 'Active', 'Disabled', 'Completed', 'InProgress', 'NotStarted'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full font-label-md whitespace-nowrap transition-colors border ${
                filter === f 
                  ? 'bg-primary text-on-primary border-primary' 
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-low'
              }`}
            >
              {f.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Judges Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-label-md">
              <th className="p-4 pl-6">Judge</th>
              <th className="p-4">Status</th>
              <th className="p-4">Completed / Pending</th>
              <th className="p-4 w-32">Progress</th>
              <th className="p-4">Last Activity</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-on-surface divide-y divide-outline-variant/20">
            {filteredJudges.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-[48px] opacity-50">search_off</span>
                    <p>No Judges match your search or filters.</p>
                    {(searchTerm || filter !== 'All') && (
                      <button 
                        onClick={() => { setSearchTerm(''); setFilter('All'); }}
                        className="text-primary hover:underline font-label-md mt-2"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredJudges.map(judge => (
                <tr key={judge.uid} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="font-label-lg">{judge.name}</div>
                    <div className="text-on-surface-variant text-sm">{judge.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      judge.status === 'disabled' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                    }`}>
                      {judge.status === 'disabled' ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm">
                    <span className="text-success font-bold">{judge.completedEvaluations}</span>
                    <span className="text-outline mx-1">/</span>
                    <span className="text-error font-bold">{judge.pendingEvaluations}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${judge.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                          style={{ width: `${judge.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono font-bold w-9 text-right text-on-surface-variant">{judge.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">
                    {judge.lastActivity ? new Date(judge.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      <Link 
                        to={`/judges/${judge.uid}`}
                        className="p-2 hover:bg-surface-container text-primary rounded-full transition-colors flex items-center justify-center"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </Link>

                      <div className="w-px h-6 bg-outline-variant/30 mx-1"></div>
                      
                      {judge.status === 'disabled' ? (
                        <button 
                          onClick={() => setConfirmAction({ type: 'enable', judge })}
                          className="p-2 hover:bg-success/10 text-success rounded-full transition-colors flex items-center justify-center"
                          title="Enable Judge"
                        >
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => setConfirmAction({ type: 'disable', judge })}
                          className="p-2 hover:bg-error/10 text-error rounded-full transition-colors flex items-center justify-center"
                          title="Disable Judge"
                        >
                          <span className="material-symbols-outlined text-[20px]">block</span>
                        </button>
                      )}

                      <button 
                        onClick={() => setConfirmAction({ type: 'demote', judge })}
                        className="p-2 hover:bg-surface-container-high text-on-surface-variant rounded-full transition-colors flex items-center justify-center"
                        title="Change Role to Participant"
                      >
                        <span className="material-symbols-outlined text-[20px]">person_off</span>
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl p-6 max-w-md w-full shadow-xl border border-outline-variant/20">
            <h3 className="font-title-lg text-on-surface mb-2 flex items-center gap-2">
              {confirmAction.type === 'disable' && <span className="material-symbols-outlined text-error">warning</span>}
              {confirmAction.type === 'demote' && <span className="material-symbols-outlined text-error">warning</span>}
              {confirmAction.type === 'enable' && <span className="material-symbols-outlined text-success">info</span>}
              
              {confirmAction.type === 'disable' && 'Disable Judge?'}
              {confirmAction.type === 'enable' && 'Enable Judge?'}
              {confirmAction.type === 'demote' && 'Demote to Participant?'}
            </h3>
            
            <div className="font-body-md text-on-surface-variant mb-6 space-y-3">
              {confirmAction.type === 'disable' && (
                <>
                  <p>Are you sure you want to disable <strong>{confirmAction.judge.name}</strong>?</p>
                  <div className="bg-surface-container-lowest p-3 rounded border border-outline-variant/30 text-sm">
                    This Judge currently has <strong>{confirmAction.judge.completedEvaluations}</strong> completed evaluations.
                    <br/><br/>
                    <strong>Note:</strong> Historical evaluations will be preserved in the database. Their progress will be excluded from the global summary once disabled.
                  </div>
                </>
              )}
              {confirmAction.type === 'enable' && (
                <p>Are you sure you want to re-enable <strong>{confirmAction.judge.name}</strong>? Their historical evaluations remain intact.</p>
              )}
              {confirmAction.type === 'demote' && (
                <>
                  <p>Change <strong>{confirmAction.judge.name}</strong>'s role to Participant?</p>
                  <p className="text-error font-medium">This will immediately revoke their Judge Portal access.</p>
                  <p className="text-sm border-l-4 border-outline p-2 bg-surface-container-lowest">Historical evaluation records will be preserved safely.</p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
                className="px-4 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                disabled={actionLoading}
                className={`px-4 py-2 font-label-md rounded-full text-white disabled:opacity-50 flex items-center gap-2 ${
                  confirmAction.type === 'enable' ? 'bg-primary hover:bg-primary/90' : 'bg-error hover:bg-error/90'
                }`}
              >
                {actionLoading && <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>}
                {confirmAction.type === 'disable' && 'Disable Judge'}
                {confirmAction.type === 'enable' && 'Enable Judge'}
                {confirmAction.type === 'demote' && 'Demote to Participant'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
