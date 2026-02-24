import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWmBBPSh4NQTC5Ry49Se3_4Ndvevmivjc",
  authDomain: "placepro-f372b.firebaseapp.com",
  projectId: "placepro-f372b",
  storageBucket: "placepro-f372b.firebasestorage.app",
  messagingSenderId: "1068486810460",
  appId: "1:1068486810460:web:5a3489fb8d2f443e457f99",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
