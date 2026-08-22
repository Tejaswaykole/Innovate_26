import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getAnnouncements = async () => {
  const response = await fetch(API_BASE_URL + '/admin/announcements', {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const createAnnouncement = async (data: any) => {
  const response = await fetch(API_BASE_URL + '/admin/announcements', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const updateAnnouncement = async (id: string, data: any) => {
  const response = await fetch(API_BASE_URL + '/admin/announcements/' + id, {
    method: 'PATCH',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const publishAnnouncement = async (id: string) => {
  const response = await fetch(API_BASE_URL + '/admin/announcements/' + id + '/publish', {
    method: 'POST',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const unpublishAnnouncement = async (id: string) => {
  const response = await fetch(API_BASE_URL + '/admin/announcements/' + id + '/unpublish', {
    method: 'POST',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const deleteAnnouncement = async (id: string) => {
  const response = await fetch(API_BASE_URL + '/admin/announcements/' + id, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getRules = async () => {
  const response = await fetch(API_BASE_URL + '/admin/rules', {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const updateRules = async (data: any) => {
  const response = await fetch(API_BASE_URL + '/admin/rules', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
