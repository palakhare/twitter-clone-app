"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  joinedDate: string;
  email: string;
  website: string;
  location: string;
  notificationsEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => Promise<void>;
  updateProfile: (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
    notificationsEnabled?: boolean;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  googlesignin: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// ----------------------- axios instance -----------------------
const API_BASE = "https://twitter-clone-app-6.onrender.com"; // Render backend
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ----------------------- AuthContext -----------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ----------------------- Sync Firebase + backend -----------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser?.email) {
          const res = await axiosInstance.get<User>("/loggedinuser", {
            params: { email: firebaseUser.email },
          });
          if (res.data) {
            setUser(res.data);
            localStorage.setItem("twitter-user", JSON.stringify(res.data));
          }
        } else {
          setUser(null);
          localStorage.removeItem("twitter-user");
        }
      } catch (err) {
        console.error("Auth sync error:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ----------------------- Login -----------------------
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const usercred = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = usercred.user;

      if (firebaseUser.email) {
        const res = await axiosInstance.get<User>("/loggedinuser", {
          params: { email: firebaseUser.email },
        });
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("twitter-user", JSON.stringify(res.data));
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- Signup -----------------------
  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    setIsLoading(true);
    try {
      const usercred = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = usercred.user;

      const newUser: Partial<User> = {
        username,
        displayName,
        avatar:
          firebaseUser.photoURL ||
          "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg",
        email: firebaseUser.email || email,
        joinedDate: new Date().toISOString(),
        bio: "",
        location: "",
        website: "",
        notificationsEnabled: true,
      };

      // Use /api/auth/register if your authRoutes have /register
      const res = await axiosInstance.post<User>("/register", newUser);

      if (res.data) {
        setUser(res.data);
        localStorage.setItem("twitter-user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- Logout -----------------------
  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("twitter-user");
  };

  // ----------------------- Update Profile -----------------------
  const updateProfile = async (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
    notificationsEnabled?: boolean;
  }) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await axiosInstance.patch<User>(
        `/userupdate/${user.email}`,
        profileData
      );

      if (res.data) {
        setUser(res.data);
        localStorage.setItem("twitter-user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- Google Sign-In -----------------------
  const googlesignin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser.email) throw new Error("No email from Google");

      let userData: User | null = null;

      // Try fetch existing user
      try {
        const res = await axiosInstance.get<User>("/loggedinuser", {
          params: { email: firebaseUser.email },
        });
        userData = res.data;
      } catch {
        // If not exist, register
        const newUser: Partial<User> = {
          username: firebaseUser.email.split("@")[0],
          displayName: firebaseUser.displayName || "User",
          avatar:
            firebaseUser.photoURL ||
            "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg",
          email: firebaseUser.email,
          joinedDate: new Date().toISOString(),
          bio: "",
          location: "",
          website: "",
          notificationsEnabled: true,
        };

        const registerRes = await axiosInstance.post<User>("/register", newUser);
        userData = registerRes.data;
      }

      if (!userData) throw new Error("User creation failed");

      setUser(userData);
      localStorage.setItem("twitter-user", JSON.stringify(userData));
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        updateProfile,
        logout,
        isLoading,
        googlesignin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
