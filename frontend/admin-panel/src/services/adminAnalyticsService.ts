import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AdminAnalyticsData {
  users: {
    total: number;
    participants: number;
    judges: number;
    admins: number;
    disabledUsers: number;
  };
  teams: {
    total: number;
    withSubmissions: number;
    withoutSubmissions: number;
  };
  submissions: {
    total: number;
    submitted: number;
    draft: number;
  };
  evaluations: {
    expected: number;
    completed: number;
    pending: number;
    completionPercentage: number;
  };
  results: {
    rankedTeams: number;
    isPublished: boolean;
    publishedAt: string | null;
    highestScore: number | null;
    lowestScore: number | null;
    averageTeamScore: number | null;
  };
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
  
  // Return raw response if it's a blob/CSV download
  if (response.headers.get('Content-Type')?.includes('text/csv')) {
    if (!response.ok) throw new Error('API Error fetching CSV');
    return response;
  }

  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Access Denied');
    }
    throw new Error(data.message || 'API Error');
  }
  return data;
};

export const getAnalyticsOverview = async (): Promise<AdminAnalyticsData> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/analytics/overview`);
  return res.data;
};

export const downloadAnalyticsExport = async (type: string): Promise<void> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/admin/analytics/export/${type}`);
  if (!(response instanceof Response)) {
      throw new Error('Invalid response type for CSV');
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  
  const cd = response.headers.get('Content-Disposition');
  let filename = `${type}_export.csv`;
  if (cd && cd.includes('filename="')) {
      filename = cd.split('filename="')[1].split('"')[0];
  }

  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
