import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface JudgingSummary {
  totalJudges: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  averageScore: number;
  judgingStatus: string;
}

export interface AdminSubmission {
  id: string;
  teamId: string;
  teamName: string;
  teamCode: string;
  leaderName: string;
  memberCount: number;
  projectTitle: string;
  status: string; // 'DRAFT' | 'SUBMITTED'
  submittedAt: string | null;
  judgingSummary: JudgingSummary;
}

export interface AdminSubmissionDetail extends AdminSubmission {
  description: string;
  proposedSolution: string;
  problemStatement: string;
  githubUrl: string | null;
  demoUrl: string | null;
  pptUrl: string | null;
  videoUrl: string | null;
  screenshotsUrl: string | null;
  leader: { uid: string, name: string, email: string } | null;
  members: Array<{ uid: string, name: string, email: string }>;
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

export const getSubmissions = async (): Promise<AdminSubmission[]> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/submissions`);
  return res.data;
};

export const getSubmissionDetails = async (submissionId: string): Promise<AdminSubmissionDetail> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/submissions/${submissionId}`);
  return res.data;
};
