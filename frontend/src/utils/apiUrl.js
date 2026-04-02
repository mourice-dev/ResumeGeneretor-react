export const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (isLocalHost && envUrl) {
    return envUrl;
  }

  return '/api';
};
