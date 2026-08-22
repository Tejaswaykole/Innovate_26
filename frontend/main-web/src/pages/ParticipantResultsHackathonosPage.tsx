import { useState, useEffect } from 'react';
import ParticipantSidebar from '../components/ParticipantSidebar';
import { motion } from 'framer-motion';

export default function ParticipantResultsHackathonosPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/results`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setData(resData.data);
        } else {
          setError(resData.error?.message || 'Results have not been published yet.');
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch results');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-primary/20">
      <div className="flex pt-16 min-h-screen">
        <ParticipantSidebar activeTab="results" />
        <main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto w-full">
          
          <div className="mb-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[40px] text-amber-500">emoji_events</span>
              Official Results
            </h1>
            <p className="text-on-surface-variant font-body-lg mt-2">The final hackathon standings are here!</p>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 text-amber-900 flex items-start gap-3 border border-amber-500/20">
            <span className="material-symbols-outlined mt-0.5 text-amber-600">campaign</span>
            <div>
              <p className="font-bold">Important Announcement</p>
              <p>Due to the limited number of total submissions (3 teams), the judging panel has decided to award only the 1st Place winning team. All other teams will receive their participant certificates.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-xl">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
          ) : error ? (
            <div className="text-center space-y-4 py-20 bg-surface-container-low rounded-2xl border border-outline-variant mt-8">
              <span className="material-symbols-outlined text-[64px] text-primary/40">lock</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">{error}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">Results will appear here once the organizers have finalized the judging process and published them.</p>
            </div>
          ) : data && data.rankings && data.rankings.length > 0 ? (
            <div className="space-y-6">
              {data.rankings.map((team: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className={`flex items-center gap-6 p-6 rounded-2xl border ${idx === 0 ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500 shadow-amber-500/20' : 'bg-surface-container-lowest border-outline-variant'} shadow-sm`}
                >
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full font-black text-2xl ${idx === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-headline-sm text-on-surface font-bold flex items-center gap-2">
                      {team.teamName}
                      {idx === 0 && <span className="material-symbols-outlined text-amber-500">star</span>}
                    </h2>
                    <p className="font-body-md text-on-surface-variant">{team.projectTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-secondary uppercase tracking-wider mb-1">Score</p>
                    <p className="font-black text-2xl text-primary">{team.finalScore.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="text-center space-y-4 py-20 bg-surface-container-low rounded-2xl border border-outline-variant mt-8">
              <span className="material-symbols-outlined text-[64px] text-primary/40">sentiment_dissatisfied</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">No Teams Ranked</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">There are no team results to display.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
