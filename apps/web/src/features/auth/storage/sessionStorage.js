const KEY = 'careerpath.auth';

export function clearSavedSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}

export function getSavedSession() {
  const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
  if (!raw) {
    return null;
  }
  try {
    const session = JSON.parse(raw);
    if (session?.accessToken && session?.refreshToken) {
      return session;
    }
  } catch {
    // Invalid saved data is cleared below.
  }
  clearSavedSession();
  return null;
}

export function isRemembered() {
  return localStorage.getItem(KEY) !== null;
}

export function saveSession(session, remember) {
  clearSavedSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(KEY, JSON.stringify(session));
}
