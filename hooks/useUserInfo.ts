import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getUserInfo,
  updateUserInfo as updateUserInfoService,
  updateCognitivePreferences as updateCognitivePrefsService,
} from '../services/userInfo';
import type { UserInfo, CognitivePreferences } from '../types/userInfo';

interface UseUserInfoResult {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  /** Atualiza preferências cognitivas com optimistic update */
  updateCognitivePrefs: (prefs: Partial<CognitivePreferences>) => Promise<void>;
  /** Atualiza campos do perfil do usuário com optimistic update */
  updateProfile: (updates: Partial<Omit<UserInfo, 'id'>>) => Promise<void>;
}

export function useUserInfo(): UseUserInfoResult {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  const fetchUserInfo = useCallback(async () => {
    if (!user) {
      setUserInfo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserInfo(user.uid);
      setUserInfo({
        ...data,
        name: user.displayName ?? data.name,
        email: user.email ?? data.email,
        avatarUrl: user.photoURL ?? data.avatarUrl,
      });
    } catch (err) {
      console.error('Erro ao carregar userInfo:', err);
      setError('Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo, fetchCount]);

  const refetch = useCallback(() => {
    setFetchCount((prev) => prev + 1);
  }, []);

  const updateCognitivePrefs = useCallback(
    async (prefs: Partial<CognitivePreferences>) => {
      if (!userInfo) return;
      const snapshot = userInfo;
      // Optimistic update
      setUserInfo({
        ...userInfo,
        cognitivePreferences: { ...userInfo.cognitivePreferences, ...prefs },
      });
      try {
        await updateCognitivePrefsService(userInfo.id, prefs);
      } catch (err) {
        setUserInfo(snapshot); // rollback
        throw err;
      }
    },
    [userInfo],
  );

  const updateProfile = useCallback(
    async (updates: Partial<Omit<UserInfo, 'id'>>) => {
      if (!userInfo) return;
      const snapshot = userInfo;
      // Optimistic update
      setUserInfo({ ...userInfo, ...updates });
      try {
        await updateUserInfoService(userInfo.id, updates);
      } catch (err) {
        setUserInfo(snapshot); // rollback
        throw err;
      }
    },
    [userInfo],
  );

  return { userInfo, loading, error, refetch, updateCognitivePrefs, updateProfile };
}