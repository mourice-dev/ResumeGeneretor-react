export const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  if (isLocalHost) {
    return 'http://localhost:5000/api';
  }

  return '/_/backend/api';
};
