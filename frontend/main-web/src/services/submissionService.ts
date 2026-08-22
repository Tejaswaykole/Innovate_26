import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const saveSubmissionDraft = async (draftData: any) => {
  const response = await fetch(`${API_BASE_URL}/submission/draft`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(draftData),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const submitFinalProject = async () => {
  const response = await fetch(`${API_BASE_URL}/submission/final`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
