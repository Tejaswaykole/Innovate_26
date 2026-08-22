import { useEffect, useState } from 'react';
import ParticipantSidebar from '../components/ParticipantSidebar';
import { getPublishedRules } from '../services/rulesService';
import ReactMarkdown from 'react-markdown';

export default function ParticipantRulesPage() {
  const [rulesContent, setRulesContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await getPublishedRules();
        setRulesContent(res.data?.rules?.content || null);
      } catch (err) {
        console.error('Error fetching rules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-primary/20">
      <div className="flex pt-16 min-h-screen">
        <ParticipantSidebar activeTab="rules" />
        <main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
            </div>
          ) : !rulesContent ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <span className="material-symbols-outlined text-[64px] text-primary/40">gavel</span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Hackathon Rules</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">Please review the rules of conduct and submission guidelines. They will be finalized and displayed here before the event begins.</p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant prose prose-neutral max-w-none">
              <ReactMarkdown>{rulesContent}</ReactMarkdown>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
