import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  teamId: string | null;
  teamName: string | null;
  createdAt: string | null;
}

const getAuthToken = async (): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Not authenticated');
  }
  return await auth.currentUser.getIdToken();
};

export const getUsers = async (): Promise<AdminUser[]> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
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
    throw new Error(data.message || 'Failed to fetch users');
  }

  return data.data as AdminUser[];
};

export const updateUserRole = async (uid: string, role: string): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/users/${uid}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user role');
  }
};

export const updateUserStatus = async (uid: string, disabled: boolean): Promise<void> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/users/${uid}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ disabled })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update account status');
  }
};
