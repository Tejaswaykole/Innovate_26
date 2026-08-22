import { useState, useEffect } from 'react';
import ParticipantSidebar from '../components/ParticipantSidebar';
import { getHackathonConfig } from '../services/hackathonService';
import type { HackathonConfig } from '../services/hackathonService';
import { motion } from 'framer-motion';
import Timeline from '../components/Timeline';
export default function ParticipantTimelinePage() {
  const [config, setConfig] = useState<HackathonConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getHackathonConfig();
        setConfig(data);
      } catch (error) {
        console.error("Failed to load config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Determine current stage based on Admin Panel setting
  let currentStage = config?.currentTimelineStage || 1;

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-primary/20">
      <div className="flex pt-16 min-h-screen">
        <ParticipantSidebar activeTab="timeline" />
        <main className="flex-1 md:ml-64 p-lg max-w-container-max mx-auto w-full">
          <div className="max-w-4xl mx-auto mt-8">
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-md">
                <h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">route</span>
                  Hackathon Progress
                </h2>
                <span className="font-caption text-caption bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
                  Stage {currentStage} of 5
                </span>
              </div>
              
              {loading ? (
                <div className="animate-pulse h-32 bg-surface-container-high rounded-xl w-full mt-8"></div>
              ) : (
                <Timeline config={config} />
              )}
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  );
}
