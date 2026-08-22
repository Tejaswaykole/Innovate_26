import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/client';

interface UserProfile {
  uid: string;
  role: 'participant' | 'judge' | 'admin';
  accountStatus: 'active' | 'suspended';
  [key: string]: any;
}

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  role: 'participant' | 'judge' | 'admin' | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  profile: null,
  loading: true,
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        unsubscribeProfile = onSnapshot(
          doc(db, 'users', user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              setProfile(userDoc.data() as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching user profile:', error);
            setProfile(null);
            setLoading(false);
          }
        );
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const value = {
    currentUser,
    profile,
    loading,
    role: profile?.role || null,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
