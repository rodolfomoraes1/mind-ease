import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import { institutionalTheme } from '../theme/institutional';
import { createUserTheme } from '../theme/userTheme';
import { UserThemePreferences, UserThemeContextType } from '../theme/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultPreferences: UserThemePreferences = {
  primaryColor: '#667EEA',
  mode: 'light',
  fontSize: 'medium',
  borderRadius: 8,
};

const UserThemeContext = createContext<UserThemeContextType | undefined>(undefined);

export const useUserTheme = () => {
  const context = useContext(UserThemeContext);
  if (!context) {
    throw new Error('useUserTheme must be used within UserThemeProvider');
  }
  return context;
};

export const DynamicThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserThemePreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const userPrefsRef = doc(db, 'userPreferences', user.uid);
        const userPrefsDoc = await getDoc(userPrefsRef);

        if (userPrefsDoc.exists()) {
          setPreferences(userPrefsDoc.data() as UserThemePreferences);
        } else {
          await setDoc(userPrefsRef, defaultPreferences);
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPreferences();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<UserThemePreferences>) => {
    if (!user) return;

    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);

    try {
      const userPrefsRef = doc(db, 'userPreferences', user.uid);
      await setDoc(userPrefsRef, updatedPrefs, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const theme = user && !isLoading 
    ? createUserTheme(preferences) 
    : institutionalTheme;

  return (
    <UserThemeContext.Provider value={{ preferences, updatePreferences, isLoading }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </UserThemeContext.Provider>
  );
};