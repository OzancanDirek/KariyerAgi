export function takeEmailConfirmationSession() {
  const hash = window.location.hash;
  if (!hash.startsWith('#access_token=')) {
    return null;
  }

  const parameters = new URLSearchParams(hash.slice(1));
  if (parameters.get('type') !== 'signup') {
    return null;
  }
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  const accessToken = parameters.get('access_token');
  const refreshToken = parameters.get('refresh_token');
  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export function takePasswordRecoveryToken() {
  const hash = window.location.hash;
  if (!hash.startsWith('#access_token=')) { return null; }
  const parameters = new URLSearchParams(hash.slice(1));
  if (parameters.get('type') !== 'recovery') { return null; }
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return parameters.get('access_token');
}
