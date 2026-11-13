export function takeEmailConfirmationSession() {
  const hash = window.location.hash;
  if (!hash.startsWith('#access_token=')) {
    return null;
  }

  const parameters = new URLSearchParams(hash.slice(1));
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  if (parameters.get('type') !== 'signup') {
    return null;
  }

  const accessToken = parameters.get('access_token');
  const refreshToken = parameters.get('refresh_token');
  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}
