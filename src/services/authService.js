import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

// Validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Sign up with email and password
export const signup = async (
  email,
  password,
  name,
  role = "student",
  degree = "",
) => {
  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!validatePassword(password)) {
      throw new Error(
        "Password must be at least 8 characters with uppercase, lowercase, and number",
      );
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    try {
      await updateProfile(user, { displayName: name });
      role = String(role).toLowerCase();
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        degree,
      });
      return user;
    } catch (fsError) {
      console.error("Firestore setup error after auth success:", fsError);
      if (fsError.code === "permission-denied") {
        throw new Error(
          "User created but profile setup failed due to missing Firestore permissions. Please ensure security rules are deployed.",
        );
      }
      throw new Error(
        `User created but profile setup failed: ${fsError.message}`,
      );
    }
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error(
        "This email is already registered. Please login instead.",
      );
    }
    throw new Error(error.message);
  }
};

// Login with email and password
export const login = async (email, password) => {
  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Fetch user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    return { user, role: userDoc.data().role };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get user profile
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    throw new Error("User not found");
  } catch (error) {
    throw new Error(error.message);
  }
};
