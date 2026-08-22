import React, { createContext, useContext, useState, useEffect } from 'react';
import { getHackathonConfig } from '../services/hackathonService';
import type { HackathonConfig } from '../services/hackathonService';

interface HackathonContextType {
  config: HackathonConfig | null;
  loading: boolean;
  hackathonName: string;
}

const HackathonContext = createContext<HackathonContextType>({
  config: null,
  loading: true,
  hackathonName: 'Hackathon', // Fallback
});

export const HackathonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<HackathonConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getHackathonConfig();
        setConfig(data);
      } catch (error) {
        console.error('Failed to load hackathon config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const hackathonName = config?.name || 'Hackathon';

  return (
    <HackathonContext.Provider value={{ config, loading, hackathonName }}>
      {children}
    </HackathonContext.Provider>
  );
};

export const useHackathon = () => useContext(HackathonContext);
