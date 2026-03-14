import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your Firebase config (ONLY the keys here)
const firebaseConfig = {
  apiKey: "AIzaSyBDj7skoQrS6iZlrIKDS90zeyKw2Wxpw9o",
  authDomain: "twitter-clone-app-ddd47.firebaseapp.com",
  projectId: "twitter-clone-app-ddd47",
  storageBucket: "twitter-clone-app-ddd47.firebasestorage.app",
  messagingSenderId: "1072052302982",
  appId: "1:1072052302982:web:ef7493929a7f60c5518d07",
  measurementId: "G-6TQYWY5K8D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Analytics (only works in browser)
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Export Auth
export const auth = getAuth(app);

export default app;
