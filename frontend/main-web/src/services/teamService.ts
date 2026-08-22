import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const createTeam = async (teamName: string) => {
  const response = await fetch(`${API_BASE_URL}/team`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ teamName }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const submitJoinRequest = async (teamCode: string) => {
  const response = await fetch(`${API_BASE_URL}/team/join`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ teamCode }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const acceptJoinRequest = async (requestId: string) => {
  const response = await fetch(`${API_BASE_URL}/team/requests/${requestId}/accept`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const rejectJoinRequest = async (requestId: string) => {
  const response = await fetch(`${API_BASE_URL}/team/requests/${requestId}/reject`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const deleteTeam = async (teamId: string) => {
  const response = await fetch(`${API_BASE_URL}/team/${teamId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const removeMember = async (teamId: string, memberId: string) => {
  const response = await fetch(`${API_BASE_URL}/team/${teamId}/members/${memberId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
