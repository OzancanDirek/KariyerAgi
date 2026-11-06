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
            const user = await sessionApi.currentUser(refreshed.accessToken);
            const next = { ...refreshed, user };
            saveSession(next, isRemembered());
            setSession(next);
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

      try {
        const refreshed = await sessionApi.refresh(saved.refreshToken);
        const user = await sessionApi.currentUser(refreshed.accessToken);
        const next = { ...refreshed, user };
        saveSession(next, isRemembered());
        setSession(next);
        return await action(next.accessToken);
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
