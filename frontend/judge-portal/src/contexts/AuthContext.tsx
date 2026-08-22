import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
    let isMounted = true;
    console.log("[AuthContext] useEffect mounted");
    
    // Safety fallback: force loading to false after 3 seconds no matter what
    const fallbackTimeout = setTimeout(() => {
      console.log("[AuthContext] Fallback timeout fired! isMounted:", isMounted);
      if (isMounted) setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthContext] onAuthStateChanged fired. User:", user?.uid);
      setCurrentUser(user);
      if (user) {
        try {
          const userDocPromise = getDoc(doc(db, 'users', user.uid));
          // Timeout getDoc to prevent infinite hang
          const userDoc = await Promise.race([
            userDocPromise,
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), 5000))
          ]);
          
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      if (isMounted) {
        console.log("[AuthContext] Setting loading to false normally");
        setLoading(false);
        clearTimeout(fallbackTimeout);
      }
    });

    return () => {
      console.log("[AuthContext] useEffect unmounting");
      isMounted = false;
      clearTimeout(fallbackTimeout);
      unsubscribe();
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
