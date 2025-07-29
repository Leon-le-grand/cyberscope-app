// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
// Firebase Imports
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth as FirebaseAuth,
  signInAnonymously,
  signInWithCustomToken // Import signInWithCustomToken
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { useNotify } from '@/components/NotificationSystem';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  lastLogin?: string;
  scanQuota?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  db: Firestore | null; // Re-introducing db and auth for direct access if needed
  auth: FirebaseAuth | null;
  appId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useNotify();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<FirebaseAuth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  const firebaseInitAttempted = useRef(false);

  // Read Firebase configuration from environment variables
  const appId = process.env.NEXT_PUBLIC_APP_ID || 'default-app-id';
  let firebaseConfig: any = {};
  try {
    if (typeof process.env.NEXT_PUBLIC_FIREBASE_CONFIG === 'string' && process.env.NEXT_PUBLIC_FIREBASE_CONFIG.length > 0) {
      firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
      // console.log("DEBUG: Parsed firebaseConfig from env:", firebaseConfig); // REMOVED THIS LINE
    } else {
        console.warn("NEXT_PUBLIC_FIREBASE_CONFIG is missing or empty. Firebase will not initialize correctly.");
    }
  } catch (e) {
    console.error("Error parsing NEXT_PUBLIC_FIREBASE_CONFIG:", e);
    notify.error("Firebase Config Error", "Could not parse Firebase configuration from environment. Check .env.local.");
  }
  const initialAuthToken = process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN || null;

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (firebaseInitAttempted.current) {
      if (auth && db) {
        setIsLoading(false);
      }
      return;
    }

    firebaseInitAttempted.current = true; // Mark as attempted

    // Only attempt initialization if firebaseConfig has an apiKey
    if (!firebaseConfig.apiKey) {
        console.error("Firebase initialization skipped: Missing API Key in config.");
        notify.error("Firebase Init Skipped", "Missing Firebase API Key. Check your .env.local file.");
        setIsLoading(false);
        return;
    }

    let currentApp: FirebaseApp;
    let currentAuth: FirebaseAuth;
    let currentDb: Firestore;

    try {
      // Initialize Firebase app if not already initialized
      if (!getApps().length) {
        console.log("Attempting to initialize Firebase with config."); // SIMPLIFIED LOG
        // console.log("Firebase Project ID from config:", firebaseConfig.projectId); // REMOVED THIS LINE
        currentApp = initializeApp(firebaseConfig);
      } else {
        currentApp = getApp(); // Get the existing app instance
        console.log("Firebase already initialized, using existing instance.");
      }

      currentAuth = getAuth(currentApp);
      currentDb = getFirestore(currentApp);

      setFirebaseApp(currentApp);
      setAuth(currentAuth);
      setDb(currentDb);
      console.log("Firebase services (Auth, Firestore) initialized successfully.");

    } catch (error: any) {
      console.error("Firebase initialization failed:", error.message, "Config used:", firebaseConfig);
      notify.error("Firebase Init Failed", `Error: ${error.message}. Check Firebase Console & API Key.`);
      setIsLoading(false);
      return; // Exit if initialization fails
    }

    // --- Auth State Listener and Initial Sign-in ---
    let unsubscribe: () => void = () => {}; // Initialize with a no-op function

    // Ensure auth and db instances are set before proceeding with listeners/sign-in
    if (currentAuth && currentDb) {
      // Attempt initial sign-in (anonymous or custom token)
      const signInInitialFn = async () => {
        try {
          if (initialAuthToken) {
            // CORRECTED: Use signInWithCustomToken if initialAuthToken is present
            await signInWithCustomToken(currentAuth, initialAuthToken);
            console.log("Signed in with custom token.");
          } else {
            await signInAnonymously(currentAuth);
            console.log("Signed in anonymously.");
          }
        } catch (error: any) {
          console.error("Initial sign-in failed:", error.message);
          // Only notify if it's a critical auth error, not just a normal sign-out
          if (!error.message.includes("auth/user-not-found") && !error.message.includes("auth/invalid-custom-token")) {
            notify.error("Initial Auth Failed", `Could not sign in: ${error.message}.`);
          }
        }
      };
      signInInitialFn(); // Call it immediately

      // Set up the onAuthStateChanged listener
      unsubscribe = onAuthStateChanged(currentAuth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch or create user profile in Firestore
          // CHANGED: Added '/data' to make the path valid (collection/document/collection/document/collection/document)
          const userDocRef = doc(currentDb, `artifacts/${appId}/users/${firebaseUser.uid}/profile/data`);
          try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              setUser(userDocSnap.data() as User);
              console.log("User profile loaded from Firestore:", userDocSnap.data());
            } else {
              // Create a new profile for the user
              const newUserProfile: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || `User-${firebaseUser.uid.substring(0, 8)}`,
                email: firebaseUser.email || `anonymous-${firebaseUser.uid.substring(0, 8)}@example.com`,
                role: 'user', // Default role
                avatar: (firebaseUser.displayName || 'U').substring(0, 2).toUpperCase(),
                lastLogin: new Date().toISOString(),
                scanQuota: 100 // Default quota
              };
              await setDoc(userDocRef, newUserProfile);
              setUser(newUserProfile);
              console.log("New user profile created in Firestore:", newUserProfile);
            }
          } catch (error: any) {
            console.error("Error fetching/creating user profile:", error.message);
            notify.error("Profile Error", `Failed to load/create user profile: ${error.message}`);
            setUser(null); // Ensure user is null on profile error
          }
        } else {
          setUser(null);
          console.log("User signed out or no user.");
        }
        setIsLoading(false); // Auth state is now known
      });
    } else {
      // Fallback if auth/db instances are somehow not available after init attempt
      setIsLoading(false);
      console.error("Firebase Auth or Firestore instances not available after initialization attempt.");
    }

    return () => {
      // Cleanup the auth state listener when component unmounts
      if (unsubscribe) unsubscribe();
    };
  }, [appId, firebaseConfig.apiKey, initialAuthToken, notify, firebaseApp, auth, db]); // Added firebaseApp, auth, db to dependencies for completeness

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!auth) {
        notify.error("Login Failed", "Firebase Auth not initialized. Please refresh.");
        return false;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // User profile will be loaded by onAuthStateChanged listener
      notify.success("Login Success", "You have been successfully logged in!");
      return true;
    } catch (error: any) {
      console.error('Login failed:', error.message);
      notify.error('Login Failed', error.message || 'Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!auth || !db) {
        notify.error("Registration Failed", "Firebase not initialized. Please refresh.");
        return false;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) { // Defensive check
        // CORRECTED: Fixed syntax error 'new new Error' to 'new Error'
        throw new Error("User not found after registration.");
      }

      // Create initial user profile in Firestore
      // CHANGED: Added '/data' to make the path valid (collection/document/collection/document/collection/document)
      const newUserProfile: User = {
        id: firebaseUser.uid,
        name: name,
        email: email,
        role: 'user', // Default role for new registrations
        avatar: (name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)),
        lastLogin: new Date().toISOString(),
        scanQuota: 100 // Default quota for new users
      };

      const userDocRef = doc(db, `artifacts/${appId}/users/${firebaseUser.uid}/profile/data`);
      await setDoc(userDocRef, newUserProfile);

      // User state will be updated by onAuthStateChanged listener
      notify.success("Registration Success", "Account created and logged in!");
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      notify.error('Registration Failed', error.message || 'Could not create account.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (!auth) {
        notify.error("Logout Failed", "Firebase Auth not initialized.");
        return;
      }
      await signOut(auth);
      notify.info("Logged Out", "You have been successfully logged out.");
    } catch (error: any) {
      console.error('Logout failed:', error.message);
      notify.error("Logout Failed", error.message || 'Could not log out.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user || !db || !auth?.currentUser) {
      console.warn("Cannot update profile: User not logged in or Firebase not initialized.");
      notify.warning("Profile Update Failed", "User not logged in or Firebase not ready.");
      return;
    }
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...updates };
      // CHANGED: Added '/data' to make the path valid (collection/document/collection/document/collection/document)
      const userDocRef = doc(db, `artifacts/${appId}/users/${auth.currentUser.uid}/profile/data`);
      await setDoc(userDocRef, updatedUser, { merge: true });
      setUser(updatedUser);
      notify.success("Profile Updated", "Your profile has been successfully updated.");
    } catch (error: any) {
      console.error('Profile update failed:', error.message);
      notify.error("Profile Update Failed", error.message || 'Could not update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile,
    db,
    auth,
    appId,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}> = ({ children, requiredRole }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied / Not Logged In</h1>
          <p className="text-slate-400 mb-4">Please log in to access this content.</p>
        </div>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

