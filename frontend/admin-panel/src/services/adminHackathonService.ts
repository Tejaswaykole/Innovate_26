import { auth } from '../lib/firebase/client';

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

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'Published';
  order: number;
  createdAt: string;
  updatedAt: string;
}

const getAuthToken = async (): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Not authenticated');
  }
  return await auth.currentUser.getIdToken();
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  const response = await fetch(url, { ...options, headers, cache: 'no-store' });
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Access Denied');
    }
    throw new Error(data.message || 'API Error');
  }
  return data;
};

// Hackathon Config API
export const getHackathonConfig = async (): Promise<HackathonConfig> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/hackathon`);
  return res.data;
};

export const updateHackathonConfig = async (config: Partial<HackathonConfig>): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/admin/hackathon`, {
    method: 'PATCH',
    body: JSON.stringify(config)
  });
};

// Problem Statements API
export const getProblemStatements = async (): Promise<ProblemStatement[]> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/problem-statements`);
  return res.data;
};

export const createProblemStatement = async (statement: { title: string, description: string }): Promise<ProblemStatement> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/problem-statements`, {
    method: 'POST',
    body: JSON.stringify(statement)
  });
  return res.data;
};

export const updateProblemStatement = async (id: string, statement: { title: string, description: string, status: string }): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/admin/problem-statements/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(statement)
  });
};

export const reorderProblemStatements = async (updates: { id: string, order: number }[]): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/admin/problem-statements/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ updates })
  });
};
