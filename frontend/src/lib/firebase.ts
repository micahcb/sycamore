import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBD0V83uPQCyBiokGPWVvhshCz_9lASzi4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "sycamore-52238.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "sycamore-52238",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "sycamore-52238.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "480422942017",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:480422942017:web:f50da7160a13e50175bdc0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-3BQ4FQYNEW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };
