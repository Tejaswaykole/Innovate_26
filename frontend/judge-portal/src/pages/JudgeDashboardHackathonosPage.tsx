import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAssignedTeams } from '../services/evaluationService';
import { Link } from 'react-router-dom';

interface TeamAvailable {
  teamId: string;
  teamName: string;
  projectTitle?: string;
  submissionStatus: string;
  myEvaluation: {
    exists: boolean;
    status: string;
    totalScore: number;
  };
}

export const JudgeDashboardHackathonosPage = () => {
  const { profile, currentUser } = useAuth();
  const [teams, setTeams] = useState<TeamAvailable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAssignedTeams();
      setTeams(res.data?.teams || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalAvailable = teams.length;
  const pendingEvals = teams.filter(
    (t) => t.myEvaluation.status !== 'SUBMITTED' && t.myEvaluation.status !== 'LOCKED'
  );
  const completedEvalsCount = teams.filter(
    (t) => t.myEvaluation.status === 'SUBMITTED' || t.myEvaluation.status === 'LOCKED'
  ).length;

  const progressPercentage = totalAvailable === 0 ? 0 : Math.round((completedEvalsCount / totalAvailable) * 100);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-primary mb-1">
              Welcome back, {profile?.fullName || currentUser?.displayName || 'Judge'}
            </h1>
            <p className="text-secondary font-medium">Review your eligible teams and complete evaluations.</p>
          </div>
        </section>

        {/* Global Error State */}
        {error && (
          <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <h2 className="font-bold text-lg mb-1">Unable to load dashboard data.</h2>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button
              onClick={loadData}
              className="px-6 py-2 bg-on-error-container text-error-container font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col justify-center">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Available Teams</h2>
            <div className="text-5xl font-black text-primary">
              {loading ? <span className="animate-pulse opacity-50">-</span> : totalAvailable}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col justify-center">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Pending Evaluations</h2>
            <div className="text-5xl font-black text-amber-500">
              {loading ? <span className="animate-pulse opacity-50">-</span> : pendingEvals.length}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col justify-center">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Completed Evaluations</h2>
            <div className="text-5xl font-black text-green-500">
              {loading ? <span className="animate-pulse opacity-50">-</span> : completedEvalsCount}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col justify-center">
            <h2 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Evaluation Progress</h2>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-primary">
                {loading ? <span className="animate-pulse opacity-50">-</span> : `${progressPercentage}%`}
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${loading ? 0 : progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Evaluation Progress"
              ></div>
            </div>
            <p className="text-xs text-secondary mt-2 font-medium">
              {completedEvalsCount} / {totalAvailable} completed
            </p>
          </div>
        </section>

        {/* Assignments Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pending Evaluations */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col h-full">
            <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">
              Pending Evaluations
            </h2>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-surface-container rounded-xl w-full"></div>
                ))}
              </div>
            ) : pendingEvals.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">check_circle</span>
                <p className="font-bold text-on-surface mb-1">All caught up!</p>
                <p className="text-sm text-secondary">You have no pending evaluations to complete.</p>
              </div>
            ) : (
              <div className="space-y-4 flex-grow">
                {pendingEvals.slice(0, 5).map((team) => (
                  <div key={team.teamId} className="flex justify-between items-center p-4 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors">
                    <div className="overflow-hidden pr-4">
                      <h3 className="font-bold text-on-surface text-base truncate">{team.teamName}</h3>
                      <p className="text-xs font-bold text-amber-600 mt-1 uppercase tracking-wide">
                        {team.myEvaluation.status || 'PENDING'}
                      </p>
                    </div>
                    <Link
                      to={`/judge/submissions/${team.teamId}`}
                      className="whitespace-nowrap px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm active:scale-95 duration-150"
                    >
                      Evaluate
                    </Link>
                  </div>
                ))}
                {pendingEvals.length > 5 && (
                  <div className="text-center pt-4">
                    <Link to="/judge/assignments" className="text-sm font-bold text-primary hover:underline">
                      View all {pendingEvals.length} pending
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Recent Teams */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col h-full">
            <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4 flex justify-between items-center">
              <span>Teams Available</span>
              <Link to="/judge/assignments" className="text-sm font-bold text-primary hover:underline">
                View All
              </Link>
            </h2>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-surface-container rounded-xl w-full"></div>
                ))}
              </div>
            ) : totalAvailable === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">inbox</span>
                <p className="font-bold text-on-surface mb-1">No eligible teams yet.</p>
                <p className="text-sm text-secondary">Submitted teams will appear here when they are available.</p>
              </div>
            ) : (
              <div className="space-y-4 flex-grow">
                {teams.slice(0, 5).map((team) => {
                  const isCompleted = team.myEvaluation.status === 'SUBMITTED' || team.myEvaluation.status === 'LOCKED';
                  return (
                    <div key={team.teamId} className="flex justify-between items-center p-4 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors">
                      <div className="overflow-hidden pr-4">
                        <h3 className="font-bold text-on-surface text-base truncate">{team.teamName}</h3>
                        <p className="text-xs text-secondary truncate mt-1">Project: {team.projectTitle || 'N/A'}</p>
                      </div>
                      <span className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {team.myEvaluation.status || 'PENDING'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};
