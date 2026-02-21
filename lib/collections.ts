import { collection, doc, CollectionReference, DocumentReference } from 'firebase/firestore';
import { db } from './firebase';
import { UserInfo } from '../types/userInfo';

export const usersCollection = collection(db, 'users') as CollectionReference<UserInfo>;

export const getUserDocRef = (userId: string): DocumentReference<UserInfo> => {
  return doc(db, 'users', userId) as DocumentReference<UserInfo>;
};