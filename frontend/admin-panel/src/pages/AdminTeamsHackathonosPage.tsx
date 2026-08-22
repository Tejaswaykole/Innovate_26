import React, { useState, useEffect, useMemo } from 'react';
import { getTeams } from '../services/adminTeamService';
import type { AdminTeam } from '../services/adminTeamService';

export const AdminTeamsHackathonosPage: React.FC = () => {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal
  const [selectedTeam, setSelectedTeam] = useState<AdminTeam | null>(null);
  
  // UI State
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load teams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter(t => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || 
        t.teamName.toLowerCase().includes(q) || 
        t.teamCode.toLowerCase().includes(q) || 
        t.leaderName.toLowerCase().includes(q) || 
        t.leaderEmail.toLowerCase().includes(q);
      
      let matchesSubmission = true;
      if (submissionFilter === 'Submitted') matchesSubmission = t.submissionStatus === 'Submitted';
      if (submissionFilter === 'Not Submitted') matchesSubmission = t.submissionStatus === 'Not Submitted';

      let matchesStatus = true;
      if (statusFilter === 'Full Team') matchesStatus = t.memberCount >= t.maxMembers;
      if (statusFilter === 'Incomplete Team') matchesStatus = t.memberCount < t.maxMembers;

      return matchesSearch && matchesSubmission && matchesStatus;
    });
  }, [teams, search, submissionFilter, statusFilter]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      setCopySuccess('Unable to copy code.');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  if (error && teams.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="bg-error/10 rounded-xl p-8 border border-error/20 text-center flex flex-col items-center justify-center min-h-[400px]">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
          <h2 className="font-headline-sm text-headline-sm text-error mb-2">{error}</h2>
          <button onClick={fetchTeams} className="mt-6 bg-error text-on-error font-label-lg py-2 px-6 rounded-lg hover:bg-error/90 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Team Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Total Teams: {teams.length}</p>
        </div>
        <button
          onClick={fetchTeams}
          aria-label="Refresh Teams"
          className="flex items-center justify-center py-2 px-4 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg font-label-md transition-colors self-start sm:self-auto border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[20px] mr-2">refresh</span>
          Refresh
        </button>
      </div>

      <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row gap-4 bg-surface-container-lowest">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search by team name, code, or leader..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              aria-label="Search Teams"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={submissionFilter}
              onChange={(e) => setSubmissionFilter(e.target.value)}
              aria-label="Filter by Submission Status"
              className="bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:outline-none focus:border-primary appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23c4c7c5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]"
            >
              <option value="All">All Submissions</option>
              <option value="Submitted">Submitted</option>
              <option value="Not Submitted">Not Submitted</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Team Status"
              className="bg-surface-container text-on-surface border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:outline-none focus:border-primary appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23c4c7c5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]"
            >
              <option value="All">All Statuses</option>
              <option value="Full Team">Full Team</option>
              <option value="Incomplete Team">Incomplete Team</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center animate-pulse">Loading teams...</div>
          ) : filteredTeams.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">search_off</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {search || submissionFilter !== 'All' || statusFilter !== 'All' 
                  ? 'No teams match your filters.' 
                  : 'No Teams Found'}
              </p>
              {(search || submissionFilter !== 'All' || statusFilter !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setSubmissionFilter('All'); setStatusFilter('All'); }}
                  className="mt-4 text-primary font-label-md hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30">
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Team Name</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Code</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Leader</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Size</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Submission</th>
                  <th className="px-4 py-3 font-label-md text-on-surface-variant whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredTeams.map(t => (
                  <tr 
                    key={t.teamId} 
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                    onClick={() => setSelectedTeam(t)}
                  >
                    <td className="px-4 py-3 font-body-md text-on-surface font-semibold">{t.teamName || '—'}</td>
                    <td className="px-4 py-3 font-body-sm font-mono text-on-surface-variant">{t.teamCode || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="font-body-sm text-on-surface">{t.leaderName || '—'}</div>
                      <div className="text-[11px] text-on-surface-variant">{t.leaderEmail || '—'}</div>
                    </td>
                    <td className="px-4 py-3 font-body-sm text-on-surface">
                      {t.memberCount} / {t.maxMembers}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        t.submissionStatus === 'Submitted' ? 'bg-success/20 text-success' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {t.submissionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                        t.status === 'eligible' ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {t.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-title-lg text-title-lg text-on-surface">Team Details</h2>
              <button 
                onClick={() => setSelectedTeam(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Team Name</p>
                  <p className="font-title-md text-on-surface font-semibold">{selectedTeam.teamName || '—'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Invite Code</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-on-surface bg-surface-container px-2 py-1 rounded">{selectedTeam.teamCode || '—'}</p>
                    {selectedTeam.teamCode && (
                      <button 
                        onClick={() => handleCopyCode(selectedTeam.teamCode)}
                        className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors flex items-center justify-center relative"
                        aria-label="Copy team code"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        {copySuccess && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap">
                            {copySuccess}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Created Date</p>
                  <p className="font-body-md text-on-surface">
                    {selectedTeam.createdAt ? new Date(selectedTeam.createdAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant mb-1">Pending Join Requests</p>
                  <p className="font-body-md text-on-surface">{selectedTeam.pendingJoinRequests}</p>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6 mb-6">
                <h3 className="font-title-sm text-on-surface mb-4 flex items-center justify-between">
                  <span>Members</span>
                  <span className="text-on-surface-variant font-body-sm bg-surface-container px-2 py-0.5 rounded-full">
                    {selectedTeam.memberCount} / {selectedTeam.maxMembers}
                  </span>
                </h3>
                <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-high border-b border-outline-variant/20">
                      <tr>
                        <th className="px-4 py-2 font-label-sm text-on-surface-variant">Name</th>
                        <th className="px-4 py-2 font-label-sm text-on-surface-variant">Email</th>
                        <th className="px-4 py-2 font-label-sm text-on-surface-variant text-right">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {selectedTeam.members.map((m, i) => (
                        <tr key={m.uid || i} className={m.uid === selectedTeam.leaderUid ? 'bg-primary/5' : ''}>
                          <td className="px-4 py-2 font-body-sm text-on-surface">
                            {m.fullName}
                            {m.uid === selectedTeam.leaderUid && (
                              <span className="ml-2 inline-block material-symbols-outlined text-[14px] text-primary align-middle" title="Team Leader">star</span>
                            )}
                          </td>
                          <td className="px-4 py-2 font-body-sm text-on-surface-variant">{m.email}</td>
                          <td className="px-4 py-2 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              m.teamRole === 'leader' ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                            }`}>
                              {m.teamRole}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6">
                <h3 className="font-title-sm text-on-surface mb-4">Submission Details</h3>
                <div className="bg-surface-container rounded-xl p-4 flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    selectedTeam.submissionStatus === 'Submitted' ? 'bg-success/20 text-success' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined">
                      {selectedTeam.submissionStatus === 'Submitted' ? 'task_alt' : 'hourglass_empty'}
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface mb-1">Status: <span className="font-bold">{selectedTeam.submissionStatus}</span></p>
                    {selectedTeam.submissionStatus === 'Submitted' && selectedTeam.submissionTime && (
                      <p className="font-body-sm text-on-surface-variant">
                        Submitted at: {new Date(selectedTeam.submissionTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
