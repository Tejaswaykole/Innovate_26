import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchAssignedTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/evaluation/assignments`, {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const fetchTeamSubmission = async (teamId: string) => {
  const response = await fetch(`${API_BASE_URL}/evaluation/teams/${teamId}`, {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const saveEvaluationDraft = async (teamId: string, criteriaScores: any, overallFeedback: string) => {
  const response = await fetch(`${API_BASE_URL}/evaluation/${teamId}/draft`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ criteriaScores, overallFeedback }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const submitFinalEvaluation = async (teamId: string, criteriaScores: any, overallFeedback: string) => {
  const response = await fetch(`${API_BASE_URL}/evaluation/${teamId}/submit`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ criteriaScores, overallFeedback }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
