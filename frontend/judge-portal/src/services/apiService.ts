import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getPublishedAnnouncements = async () => {
  const response = await fetch(API_BASE_URL + '/public/announcements', {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getPublishedRules = async () => {
  const response = await fetch(API_BASE_URL + '/public/rules', {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getAssignedTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/judge/assigned-teams`, {
    headers: await getAuthHeaders()
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getTeamSubmission = async (teamId: string) => {
  const response = await fetch(`${API_BASE_URL}/judge/submissions/${teamId}`, {
    headers: await getAuthHeaders()
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const submitEvaluation = async (teamId: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/judge/evaluations/${teamId}`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
