import { useEffect, useState, useMemo } from 'react';
import { fetchAssignedTeams } from '../services/evaluationService';
import { Link } from 'react-router-dom';

interface JudgingSummary {
  totalJudges: number;
  completedJudges: number;
  pendingJudges: number;
  averageScore: number;
  finalScore: number | null;
  status: string;
}

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
  judgingSummary: JudgingSummary;
}

export default function AssignedTeamsJudgePortalPage() {
  const [teams, setTeams] = useState<TeamAvailable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadTeams = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAssignedTeams();
      setTeams(res.data?.teams || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const matchesSearch = team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (team.projectTitle && team.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const myStatus = team.myEvaluation.status;
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'pending' && (myStatus === 'PENDING' || myStatus === 'IN_PROGRESS' || myStatus === 'NOT_STARTED')) ||
                            (statusFilter === 'submitted' && myStatus === 'SUBMITTED');
                            
      return matchesSearch && matchesStatus;
    });
  }, [teams, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col gap-lg md:flex-row md:items-center md:justify-between border-b border-outline-variant pb-6">
          <div>
            <h1 className="text-3xl font-black text-primary mb-2">Teams Available for Judging</h1>
            <p className="text-secondary font-medium">Review and evaluate eligible submitted teams.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm text-on-surface shadow-sm outline-none" 
                placeholder="Search teams..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <select 
                className="w-full pl-4 pr-10 py-2 appearance-none bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm text-on-surface shadow-sm cursor-pointer outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="submitted">Completed</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <h2 className="font-bold text-lg mb-1">Unable to load teams.</h2>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button
              onClick={loadTeams}
              className="px-6 py-2 bg-on-error-container text-error-container font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}

        <section>
          {loading ? (
            <div className="animate-pulse space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="h-48 bg-white border border-outline-variant rounded-2xl"></div>
                 ))}
               </div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-secondary py-16 text-center bg-white border border-dashed border-outline-variant rounded-2xl shadow-sm flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">inbox</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">No Eligible Teams</h3>
              <p className="font-medium text-sm">There are no submitted teams ready for judging yet.</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-secondary py-16 text-center bg-white border border-dashed border-outline-variant rounded-2xl shadow-sm flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">No results found</h3>
              <p className="font-medium text-sm">No teams match your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => {
                const myStatus = team.myEvaluation.status;
                const isCompleted = myStatus === 'SUBMITTED' || myStatus === 'LOCKED';
                
                return (
                  <article key={team.teamId} className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-bold text-on-surface truncate">{team.teamName}</h3>
                      <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                        {team.submissionStatus || 'SUBMITTED'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                        <span className="truncate">Project: {team.projectTitle || 'Not specified'}</span>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-secondary font-medium">My Evaluation:</span>
                          <span className={`font-bold ${isCompleted ? 'text-green-600' : 'text-amber-600'}`}>
                            {isCompleted ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-secondary font-medium">Judging:</span>
                          <span className="font-bold text-on-surface">
                            {team.judgingSummary.completedJudges} / {team.judgingSummary.totalJudges} completed
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary font-medium">
                            {team.judgingSummary.status === 'COMPLETE' ? 'Average:' : 'Provisional Average:'}
                          </span>
                          <span className="font-bold text-on-surface">
                            {team.judgingSummary.averageScore ? team.judgingSummary.averageScore.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-outline-variant">
                      <Link 
                        to={`/judge/submissions/${team.teamId}`}
                        className={`w-full block text-center font-bold text-sm py-2.5 px-4 rounded-xl transition-colors shadow-sm active:scale-95 duration-150 ${
                          isCompleted 
                            ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant' 
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {isCompleted ? 'View Evaluation' : 'Evaluate Team'}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
