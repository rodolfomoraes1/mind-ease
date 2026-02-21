import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

import { userInfoMock } from './userInfoMock';
import type { UserInfo } from '../../types/userInfo';
import { defaultCognitivePreferences } from '../../types/userInfo';
import { db, auth } from '@/lib/firebase';

const USE_MOCK = false;

export const getUserInfo = async (userId: string): Promise<UserInfo> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      ...userInfoMock,
      id: userId,
    };
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserInfo;
    }

    // Se não existir, cria automaticamente com dados básicos do Auth
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    const newUser = await createUserInfo(userId, {
      name: user.displayName || 'Usuário',
      email: user.email || '',
      avatarUrl: user.photoURL || '',
    });

    return newUser;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

export const createUserInfo = async (
  userId: string,
  userData: Partial<UserInfo> & { name: string; email: string }
): Promise<UserInfo> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: userId,
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl,
      navigationProfile: userData.navigationProfile || 'beginner',
      specificNeeds: userData.specificNeeds || [],
      studyRoutine: userData.studyRoutine || '',
      workRoutine: userData.workRoutine || '',
      cognitivePreferences: {
        ...defaultCognitivePreferences,
        ...userData.cognitivePreferences,
      },
    };
  }

  try {
    const userRef = doc(db, 'users', userId);
    
    const newUser: UserInfo = {
      id: userId,
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl || '',
      navigationProfile: userData.navigationProfile || 'beginner',
      specificNeeds: userData.specificNeeds || [],
      studyRoutine: userData.studyRoutine || '',
      workRoutine: userData.workRoutine || '',
      cognitivePreferences: {
        ...defaultCognitivePreferences,
        ...userData.cognitivePreferences,
      },
    };

    await setDoc(userRef, {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return newUser;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

export const updateUserInfo = async (
  userId: string,
  updates: Partial<UserInfo>
): Promise<void> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock update:', { userId, updates });
    return;
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

export const updateCognitivePreferences = async (
  userId: string,
  preferences: Partial<UserInfo['cognitivePreferences']>
): Promise<void> => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Mock update preferences:', { userId, preferences });
    return;
  }

  try {
    const userRef = doc(db, 'users', userId);
    
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const currentData = userSnap.data() as UserInfo;
      const updatedPreferences = {
        ...currentData.cognitivePreferences,
        ...preferences,
      };
      
      await updateDoc(userRef, {
        cognitivePreferences: updatedPreferences,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
    throw error;
  }
};

export const addSpecificNeed = async (
  userId: string,
  need: string
): Promise<void> => {
  if (USE_MOCK) {
    console.log('Mock add need:', { userId, need });
    return;
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserInfo;
      if (!userData.specificNeeds.includes(need)) {
        const updatedNeeds = [...userData.specificNeeds, need];
        await updateDoc(userRef, {
          specificNeeds: updatedNeeds,
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    console.error('Erro ao adicionar necessidade:', error);
    throw error;
  }
};

export const removeSpecificNeed = async (
  userId: string,
  need: string
): Promise<void> => {
  if (USE_MOCK) {
    console.log('Mock remove need:', { userId, need });
    return;
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserInfo;
      const updatedNeeds = userData.specificNeeds.filter(n => n !== need);
      await updateDoc(userRef, {
        specificNeeds: updatedNeeds,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Erro ao remover necessidade:', error);
    throw error;
  }
};