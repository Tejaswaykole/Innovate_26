import { auth } from '../lib/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = async () => {
  try {
    console.log("Getting auth headers...");
    // Add a 5 second timeout to getIdToken just in case Firebase hangs
    const tokenPromise = auth.currentUser?.getIdToken();
    if (!tokenPromise) return { 'Content-Type': 'application/json', 'Authorization': `Bearer undefined` };
    
    const token = await Promise.race([
      tokenPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase token fetch timeout")), 5000))
    ]);
    
    console.log("Token received.");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  } catch (err) {
    console.error("Error in getAuthHeaders:", err);
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer undefined` };
  }
};

export const fetchDashboardStats = async () => {
  console.log("fetchDashboardStats called...");
  const headers = await getAuthHeaders();
  console.log("Headers fetched, calling API...");
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    console.log("API responded with status:", response.status);
    
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("fetch API failed:", err);
    throw err;
  }
};

export const createJudgeAccount = async (judgeData: any) => {
  const response = await fetch(`${API_BASE_URL}/admin/judges`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(judgeData),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const assignJudgeToTeam = async (judgeUid: string, teamId: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/assignments`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ judgeUid, teamId }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const publishOfficialResults = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/results/publish`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
