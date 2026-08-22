

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface HackathonConfig {
  name: string;
  description: string;
  status: string;
  currentTimelineStage: number;
  registrationDeadline: string | null;
  teamFormationDate: string | null;
  hackingBeginsDate: string | null;
  submissionOpensDate: string | null;
  submissionDeadline: string | null;
  ceremonyDate: string | null;
}

export const getHackathonConfig = async (): Promise<HackathonConfig> => {
  const response = await fetch(`${API_BASE_URL}/participant/hackathon`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch hackathon config');
  }

  return data.data as HackathonConfig;
};
