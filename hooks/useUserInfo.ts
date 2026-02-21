import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getUserInfo } from '../services/userInfo';
import type { UserInfo } from '../types/userInfo';

interface UseUserInfoResult {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
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
    setFetchCount(prev => prev + 1);
  }, []);

  return { userInfo, loading, error, refetch };
}