import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface JudgeData {
  uid: string;
  name: string;
  email: string;
  status: string; // 'active' or 'disabled'
  eligibleTeams: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  progress: number;
  lastActivity: string | null;
}

export interface JudgingSummary {
  totalJudges: number;
  activeJudges: number;
  eligibleTeams: number;
  expectedEvaluations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  progress: number;
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

export const getJudges = async (): Promise<JudgeData[]> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/judges`);
  return res.data;
};

export const getJudgingSummary = async (): Promise<JudgingSummary> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/judging-summary`);
  return res.data;
};

export const updateJudgeStatus = async (uid: string, status: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/admin/users/${uid}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

export const updateJudgeRole = async (uid: string, role: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/admin/users/${uid}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role })
  });
};
