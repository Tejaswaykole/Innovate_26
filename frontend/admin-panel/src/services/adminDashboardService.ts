import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface RecentActivityItem {
  id: string;
  type: 'PARTICIPANT_REGISTERED' | 'JUDGE_REGISTERED' | 'TEAM_CREATED' | 'PROJECT_SUBMITTED' | 'EVALUATION_COMPLETED';
  title: string;
  description: string;
  timestamp: string;
}

export interface AdminDashboardStats {
  participants: number;
  teams: number;
  judges: number;
  submissions: number;
  evaluationsCompleted: number;
  evaluationsPending: number;
  hackathonStatus: string | null;
  recentActivity: RecentActivityItem[];
}

export const getDashboardStats = async (): Promise<AdminDashboardStats> => {
  if (!auth.currentUser) {
    throw new Error('Not authenticated');
  }

  const token = await auth.currentUser.getIdToken();

  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Access Denied');
    }
    throw new Error(data.message || 'Failed to fetch dashboard stats');
  }

  return data.data as AdminDashboardStats;
};
