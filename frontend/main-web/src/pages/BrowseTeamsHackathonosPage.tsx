import { useState, useEffect } from 'react';
// Link import removed
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import ParticipantSidebar from '../components/ParticipantSidebar';
import { db } from '../lib/firebase/client';
import PageTransitionWrapper from '../components/PageTransitionWrapper';
import { motion } from 'framer-motion';

import { submitJoinRequest } from '../services/teamService';

interface TeamData {
  id: string;
  teamName?: string;
  teamCode?: string;
  memberCount?: number;
  members?: string[];
  [key: string]: any;
}

export default function BrowseTeamsHackathonosPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingCode, setRequestingCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsQuery = query(
          collection(db, 'teams'),
          where('status', '==', 'active'),
          limit(20)
        );
        const snapshot = await getDocs(teamsQuery);
        const fetchedTeams: TeamData[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamData));
        // Filter available teams (less than 6 members)
        setTeams(fetchedTeams.filter(t => (t.memberCount || t.members?.length || 0) < 6));
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleJoinTeam = async (teamCode: string) => {
    setRequestingCode(teamCode);
    setMessage(null);
    try {
      await submitJoinRequest(teamCode);
      setMessage({ type: 'success', text: 'Join request sent successfully!' });
    } catch (err: any) {
      let errorMessage = 'Failed to send request';
      try {
        const errorData = JSON.parse(err.message);
        errorMessage = errorData?.error?.message || errorData?.message || errorMessage;
      } catch (e) {
        errorMessage = err.message || errorMessage;
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setRequestingCode(null);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-primary/20">
      <div className="flex pt-16 min-h-screen">
        <ParticipantSidebar activeTab="team" />

        <main className="flex-1 md:ml-64 p-6 lg:p-8 overflow-y-auto w-full">
          <PageTransitionWrapper>
          <div className="max-w-container-max mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
              <div>
                <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-on-surface mb-2 tracking-tight">Browse Teams</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Find a team to join or explore ongoing projects.</p>
              </div>
              <div className="flex items-center gap-3 bg-surface-container p-3 rounded-xl border border-outline-variant/50">
                <div className="flex flex-col items-end">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[10px]">Requests Used</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold leading-none mt-1">0 <span className="text-on-surface-variant/50 font-normal">/ 5</span></span>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined" data-icon="send">send</span>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg font-body-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined" data-icon="search">search</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg leading-5 bg-surface-container-lowest text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:ring-opacity-50 transition-all font-body-md sm:text-sm" placeholder="Search by team name, tags, or skills..." type="text"/>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 bg-surface-container-lowest" type="checkbox"/>
                  <span className="font-body-md text-sm text-on-surface">Available Teams Only</span>
                </label>
                <div className="h-6 w-px bg-outline-variant/50 hidden md:block"></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg border border-outline-variant/50 text-on-surface font-label-md text-sm hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]" data-icon="filter_list">filter_list</span>
                  Filters
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
                </div>
              ) : teams.length === 0 ? (
                <div className="col-span-full bg-surface-container-lowest rounded-xl border border-outline-variant p-8 shadow-sm text-center flex flex-col items-center justify-center py-16">
                    <span className="material-symbols-outlined text-[48px] text-primary/40 mb-4">search_off</span>
                    <h3 className="font-headline-md text-xl text-on-surface font-bold mb-2">No Teams Found</h3>
                    <p className="font-body-md text-on-surface-variant max-w-md">There are currently no teams looking for members. Check back later or create your own team!</p>
                </div>
              ) : (
                teams.map((team, i) => (
                  <motion.div 
                    key={team.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col hover:border-primary transition-colors cursor-default"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-headline-md text-lg text-on-surface font-bold truncate pr-2">{team.teamName}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-container text-on-secondary-container font-caption text-xs rounded-full whitespace-nowrap">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {team.memberCount || team.members?.length || 0}/6
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="font-body-sm text-sm text-on-surface-variant mb-2">Code: <span className="font-bold tracking-widest text-on-surface">{team.teamCode || 'N/A'}</span></p>
                    </div>
                    <div className="mt-auto">
                      {team.teamCode ? (
                        <button 
                          onClick={() => handleJoinTeam(team.teamCode!)}
                          disabled={requestingCode === team.teamCode}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container font-label-md text-sm rounded-lg hover:bg-primary-container/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {requestingCode === team.teamCode ? 'sync' : 'person_add'}
                          </span>
                          {requestingCode === team.teamCode ? 'Requesting...' : 'Request to Join'}
                        </button>
                      ) : (
                        <button disabled className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-container text-on-surface-variant font-label-md text-sm rounded-lg opacity-50 cursor-not-allowed">
                          Private Team
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

          </div>
          </PageTransitionWrapper>
        </main>
      </div>
    </div>
  );
}
