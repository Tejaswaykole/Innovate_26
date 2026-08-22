import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJudges, updateJudgeStatus, updateJudgeRole } from '../services/adminJudgeService';
import type { JudgeData } from '../services/adminJudgeService';

export const AdminJudgeDetailHackathonosPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const [judge, setJudge] = useState<JudgeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'disable' | 'enable' | 'demote' | null>(null);

  const fetchJudgeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const allJudges = await getJudges();
      const found = allJudges.find(j => j.uid === uid);
      if (found) {
        setJudge(found);
      } else {
        setError('Judge not found or no longer has Judge role.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load judge details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) fetchJudgeData();
  }, [uid]);

  const executeAction = async () => {
    if (!judge || !confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction === 'disable') {
        await updateJudgeStatus(judge.uid, 'disabled');
        fetchJudgeData(); // reload
      } else if (confirmAction === 'enable') {
        await updateJudgeStatus(judge.uid, 'active');
        fetchJudgeData(); // reload
      } else if (confirmAction === 'demote') {
        await updateJudgeRole(judge.uid, 'participant');
        navigate('/judges');
      }
      setConfirmAction(null);
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse pt-20">Loading judge details...</div>;
  }

  if (error || !judge) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 bg-surface-container-low border border-outline-variant rounded-xl text-center">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
        <h2 className="font-headline-sm mb-2">{error || 'Judge Not Found'}</h2>
        <Link to="/judges" className="text-primary hover:underline">Return to Judges List</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full pb-20">
      
      <Link to="/judges" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Judges
      </Link>

      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* Header Profile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-outline-variant/30">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md uppercase border border-primary/20">
              {(judge.name || 'J').charAt(0)}
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-3">
                {judge.name}
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${
                  judge.status === 'disabled' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                }`}>
                  {judge.status === 'disabled' ? 'Disabled' : 'Active'}
                </span>
              </h1>
              <p className="font-body-md text-on-surface-variant mt-1">{judge.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {judge.status === 'disabled' ? (
              <button 
                onClick={() => setConfirmAction('enable')}
                className="px-4 py-2 border border-outline-variant hover:bg-success/10 text-success rounded-full font-label-md transition-colors"
              >
                Enable Access
              </button>
            ) : (
              <button 
                onClick={() => setConfirmAction('disable')}
                className="px-4 py-2 border border-outline-variant hover:bg-error/10 text-error rounded-full font-label-md transition-colors"
              >
                Disable Access
              </button>
            )}
            <button 
              onClick={() => setConfirmAction('demote')}
              className="px-4 py-2 border border-outline-variant hover:bg-surface-container text-on-surface-variant rounded-full font-label-md transition-colors"
            >
              Change to Participant
            </button>
          </div>
        </div>

        {/* Judging Summary Block */}
        <div className="mb-6">
          <h2 className="font-title-lg text-title-lg text-on-surface mb-4">Judging Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4">
              <div className="text-on-surface-variant font-label-sm mb-1">Eligible Teams</div>
              <div className="font-headline-md text-headline-md text-on-surface">{judge.eligibleTeams}</div>
            </div>

            <div className="bg-surface-container-lowest border border-success/30 bg-success/5 rounded-xl p-4">
              <div className="text-on-surface-variant font-label-sm mb-1">Completed</div>
              <div className="font-headline-md text-headline-md text-success">{judge.completedEvaluations}</div>
            </div>

            <div className="bg-surface-container-lowest border border-error/30 bg-error/5 rounded-xl p-4">
              <div className="text-on-surface-variant font-label-sm mb-1">Pending</div>
              <div className="font-headline-md text-headline-md text-error">{judge.pendingEvaluations}</div>
            </div>

            <div className="bg-surface-container-lowest border border-primary/30 bg-primary/5 rounded-xl p-4 relative overflow-hidden">
              <div className="text-on-surface-variant font-label-sm mb-1 z-10 relative">Progress</div>
              <div className="font-headline-md text-headline-md text-primary z-10 relative">{judge.progress}%</div>
              <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all" style={{ width: `${judge.progress}%` }}></div>
            </div>

          </div>
        </div>

        {/* Security / Privacy Warning */}
        <div className="mt-8 bg-surface-container-lowest p-4 rounded-xl border-l-4 border-l-primary/50 text-sm font-body-md text-on-surface-variant">
          <strong>Privacy Note:</strong> Detailed individual evaluation scores and private feedback are hidden from this monitoring view to protect judging integrity. Authorized admins can review aggregate scores in the Results portal when Judging is complete.
        </div>

        <div className="mt-6 text-sm text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          Last evaluation activity: {judge.lastActivity ? new Date(judge.lastActivity).toLocaleString() : 'Never'}
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl p-6 max-w-md w-full shadow-xl border border-outline-variant/20">
            <h3 className="font-title-lg text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-warning">warning</span>
              Confirm Action
            </h3>
            <div className="font-body-md text-on-surface-variant mb-6 space-y-3">
              {confirmAction === 'disable' && <p>Disable {judge.name}'s account? They will lose access immediately. Historical evaluations are preserved.</p>}
              {confirmAction === 'enable' && <p>Re-enable {judge.name}'s account? They will regain access to their evaluations.</p>}
              {confirmAction === 'demote' && <p>Change {judge.name} to a Participant? They will be removed from this list. Historical evaluations are preserved.</p>}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 rounded-full font-label-md text-primary hover:bg-primary/10">Cancel</button>
              <button 
                onClick={executeAction}
                disabled={actionLoading}
                className="px-4 py-2 rounded-full font-label-md bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-2"
              >
                {actionLoading && <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span>}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
