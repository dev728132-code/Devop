import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

interface UserData {
  email: string;
  role: 'user' | 'reseller' | 'admin';
  isBanned: boolean;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const initialDoc = await getDoc(userDocRef);
          
          if (!initialDoc.exists()) {
            // Check if admin
            const role = currentUser.email === 'dev728132@gmail.com' ? 'admin' : 'user';
            const newUser: UserData = {
              email: currentUser.email || '',
              role,
              isBanned: false,
              walletBalance: 0,
            };
            await setDoc(userDocRef, {
              ...newUser,
              createdAt: serverTimestamp()
            });
          }

          if (unsubscribeDoc) unsubscribeDoc();
          unsubscribeDoc = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              setUserData(snap.data() as UserData);
            }
            setLoading(false);
          });
        } catch (err) {
          console.error("Error fetching/creating user", err);
          setLoading(false);
        }
      } else {
        setUserData(null);
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = undefined;
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const signOut = () => firebaseSignOut(auth);

  const isAdmin = userData?.role === 'admin' || user?.email === 'dev728132@gmail.com';

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
