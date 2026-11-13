import { useEffect, useRef, useState } from 'react';
import { authenticationApi } from '../api/authenticationApi.js';
import { sessionApi } from '../api/sessionApi.js';
import { clearSavedSession, getSavedSession, isRemembered, saveSession } from '../storage/sessionStorage.js';
import { takeEmailConfirmationSession } from '../authRedirect.js';

let emailConfirmationSession = takeEmailConfirmationSession();

export function useAuthentication() {
  const [session, setSession] = useState(getSavedSession);
  const [ready, setReady] = useState(false);
  const refreshInFlight = useRef(null);

  function clearInvalidSession(error) {
    if (error.status === 400 || error.status === 401) {
      clearSavedSession();
      setSession(null);
    }
  }

  function refreshSession(saved) {
    if (!refreshInFlight.current) {
      refreshInFlight.current = (async () => {
        const refreshed = await sessionApi.refresh(saved.refreshToken);
        const user = await sessionApi.currentUser(refreshed.accessToken);
        const next = { ...refreshed, user };
        saveSession(next, isRemembered());
        setSession(next);
        return next;
      })().finally(() => {
        refreshInFlight.current = null;
      });
    }
    return refreshInFlight.current;
  }

  useEffect(() => {
    let active = true;
    const saved = getSavedSession();
    const confirmed = emailConfirmationSession;
    emailConfirmationSession = null;

    async function restoreSession() {
      if (confirmed) {
        try {
          const user = await sessionApi.currentUser(confirmed.accessToken);
          if (active) {
            const next = { ...confirmed, user };
            saveSession(next, true);
            setSession(next);
          }
        } catch {
          if (active) {
            clearSavedSession();
            setSession(null);
          }
        } finally {
          if (active) {
            setReady(true);
          }
        }
        return;
      }

      if (!saved) {
        setReady(true);
        return;
      }
      try {
        const user = await sessionApi.currentUser(saved.accessToken);
        if (active) {
          setSession({ ...saved, user });
        }
      } catch (error) {
        try {
          if (error.status === 401) {
            const refreshed = await sessionApi.refresh(saved.refreshToken);
            const user = await sessionApi.currentUser(refreshed.accessToken);
            if (active) {
              const next = { ...refreshed, user };
              saveSession(next, isRemembered());
              setSession(next);
            }
          }
        } catch (refreshError) {
          if (active) {
            clearInvalidSession(refreshError);
          }
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }
    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  async function login(credentials, rememberMe) {
    const result = await authenticationApi.login(credentials);
    const user = await sessionApi.currentUser(result.accessToken);
    const next = { ...result, user };
    saveSession(next, rememberMe);
    setSession(next);
  }

  async function register(details) {
    const result = await authenticationApi.register(details);
    if (result.session) {
      const user = await sessionApi.currentUser(result.session.accessToken);
      const next = { ...result.session, user };
      saveSession(next, true);
      setSession(next);
    }
    return result;
  }

  async function runAuthenticated(action) {
    const saved = getSavedSession();
    if (!saved) {
      throw new Error('Oturum bulunamadı. Yeniden giriş yapın.');
    }

    try {
      return await action(saved.accessToken);
    } catch (error) {
      if (error.status !== 401) {
        throw error;
      }

      const latest = getSavedSession();
      if (latest?.accessToken && latest.accessToken !== saved.accessToken) {
        return action(latest.accessToken);
      }

      let refreshed;
      try {
        refreshed = await refreshSession(saved);
      } catch (refreshError) {
        clearInvalidSession(refreshError);
        throw refreshError;
      }
      return action(refreshed.accessToken);
    }
  }

  async function logout() {
    try {
      if (session?.accessToken) {
        await authenticationApi.logout(session.accessToken);
      }
    } catch {
      // Sunucuya ulaşılamasa da cihazdaki oturum kapatılır.
    } finally {
      clearSavedSession();
      setSession(null);
    }
  }

  return { session, ready, login, register, logout, runAuthenticated };
}
