import { useEffect, useState } from 'react';
import { authenticationApi } from '../api/authenticationApi.js';
import { sessionApi } from '../api/sessionApi.js';
import { clearSavedSession, getSavedSession, isRemembered, saveSession } from '../storage/sessionStorage.js';

export function useAuthentication() {
  const [session, setSession] = useState(getSavedSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const saved = getSavedSession();

    async function restoreSession() {
      if (!saved) {
        setReady(true);
        return;
      }
      try {
        const user = await sessionApi.currentUser(saved.accessToken);
        if (active) {
          setSession({ ...saved, user });
        }
      } catch {
        try {
          const refreshed = await sessionApi.refresh(saved.refreshToken);
          if (active) {
            saveSession(refreshed, isRemembered());
            setSession(refreshed);
          }
        } catch {
          if (active) {
            clearSavedSession();
            setSession(null);
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
    const next = await authenticationApi.login(credentials);
    saveSession(next, rememberMe);
    setSession(next);
  }

  async function register(details) {
    const result = await authenticationApi.register(details);
    if (result.session) {
      saveSession(result.session, true);
      setSession(result.session);
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

      try {
        const refreshed = await sessionApi.refresh(saved.refreshToken);
        saveSession(refreshed, isRemembered());
        setSession(refreshed);
        return await action(refreshed.accessToken);
      } catch (refreshError) {
        clearSavedSession();
        setSession(null);
        throw refreshError;
      }
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
