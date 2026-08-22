import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AdminTeamResult {
  teamId: string;
  teamName: string;
  teamCode: string;
  projectTitle: string;
  finalScore: number;
  rank: number;
}

export interface AdminResultsData {
  status: 'PUBLISHED' | 'PREVIEW' | 'NOT_READY';
  message?: string;
  publishedAt: string | null;
  rankings: AdminTeamResult[];
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
  
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Access Denied');
    }
    throw new Error(data.message || 'API Error');
  }
  return data;
};

export const getResults = async (): Promise<AdminResultsData> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/results`);
  return res.data;
};

export const publishResults = async (): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/admin/results/publish`, {
    method: 'POST'
  });
};

export const unpublishResults = async (): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/admin/results/unpublish`, {
    method: 'POST'
  });
};
