import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AdminEvaluation {
  id: string;
  evaluationId: string;
  teamId: string;
  judgeUid: string;
  teamName: string;
  teamCode: string;
  projectTitle: string;
  judgeName: string;
  judgeEmail: string;
  status: string; // 'DRAFT' | 'SUBMITTED'
  totalScore: number;
  submittedAt: string | null;
}

export interface CriteriaScore {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  comments: string;
}

export interface AdminEvaluationDetail extends AdminEvaluation {
  criteriaScores: CriteriaScore[];
  overallFeedback: string;
}

export interface JudgeProgress {
  judgeUid: string;
  judgeName: string;
  completed: number;
  expected: number;
}

export interface TeamProgress {
  teamId: string;
  teamName: string;
  completed: number;
  expected: number;
}

export interface AdminEvaluationSummary {
  totalJudges: number;
  eligibleTeams: number;
  expectedEvaluations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  progress: number;
  completedJudgingTeams: number;
  judgeProgress: JudgeProgress[];
  teamProgress: TeamProgress[];
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

export const getEvaluations = async (): Promise<AdminEvaluation[]> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/evaluations`);
  return res.data;
};

export const getEvaluationDetails = async (evaluationId: string): Promise<AdminEvaluationDetail> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/evaluations/${evaluationId}`);
  return res.data;
};

export const getEvaluationSummary = async (): Promise<AdminEvaluationSummary> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/evaluations/summary`);
  return res.data;
};
