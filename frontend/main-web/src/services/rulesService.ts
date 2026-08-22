// Fallback to a hardcoded URL for the main web if config doesn't exist
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const getPublishedRules = async () => {
  const response = await fetch(API_BASE_URL + '/public/rules', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getPublishedAnnouncements = async () => {
  const response = await fetch(API_BASE_URL + '/public/announcements', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
