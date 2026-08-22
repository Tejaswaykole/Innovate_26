import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AdminTeamMember {
  uid: string;
  fullName: string;
  email: string;
  teamRole: string;
}

export interface AdminTeam {
  teamId: string;
  teamName: string;
  teamCode: string;
  leaderUid: string;
  leaderName: string;
  leaderEmail: string;
  members: AdminTeamMember[];
  memberCount: number;
  maxMembers: number;
  submissionStatus: 'Submitted' | 'Not Submitted';
  submissionTime?: string | null;
  pendingJoinRequests: number;
  createdAt: string | null;
  status: string;
}

const getAuthToken = async (): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Not authenticated');
  }
  return await auth.currentUser.getIdToken();
};

export const getTeams = async (): Promise<AdminTeam[]> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/teams`, {
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
    throw new Error(data.message || 'Failed to fetch teams');
  }

  return data.data as AdminTeam[];
};
