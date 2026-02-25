import app, { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Submit an application (ensure called after auth and uses request.auth.uid == userId per rules)
export async function submitApplication(jobId, userId, resumeUrl, userName) {
  const applicationsRef = collection(db, "applications");
  const docRef = await addDoc(applicationsRef, {
    jobId,
    userId,
    resumeUrl,
    userName,
    status: "applied",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function checkDuplicateApplication(jobId, userId) {
  const q = query(
    collection(db, "applications"),
    where("jobId", "==", jobId),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getApplicationsForJob(jobId) {
  const q = query(collection(db, "applications"), where("jobId", "==", jobId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getApplicationsByStudent(userId) {
  const q = query(
    collection(db, "applications"),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateApplicationStatus(appId, status) {
  try {
    const ref = doc(db, "applications", appId);
    await updateDoc(ref, { status });
    return true;
  } catch (error) {
    throw new Error(`Error updating application: ${error.message}`);
  }
}

export async function deleteApplication(appId) {
  await deleteDoc(doc(db, "applications", appId));
}

// Upload resume as Base64 and return data URL
export async function uploadResume(file, userId, onProgress = () => {}) {
  if (!file) throw new Error("No file provided");
  console.log("Starting Base64 resume conversion for user:", userId);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadstart = () => onProgress(0.1);
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded / event.total);
      }
    };

    reader.onload = () => {
      console.log("Conversion successful");
      onProgress(1.0);
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

// Open resume in a new tab (handles Base64 conversion to Blob for better stability)
export function openResume(resumeUrl) {
  if (!resumeUrl) return;

  if (resumeUrl.startsWith("https://demo-resume-fallback.com")) {
    alert(
      "This is an old application with a legacy resume link that is no longer active. Please test with a NEW application/upload.",
    );
    return;
  }

  if (resumeUrl.startsWith("data:application/pdf;base64,")) {
    try {
      const base64 = resumeUrl.split(",")[1];
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening Base64 PDF:", error);
      alert("Error opening resume. Please try a different PDF.");
    }
  } else {
    window.open(resumeUrl, "_blank");
  }
}
