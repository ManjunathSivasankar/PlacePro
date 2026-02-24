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

// Upload resume to Firebase Storage and return download URL
export async function uploadResume(file, userId, onProgress = () => {}) {
  if (!file) throw new Error("No file provided");
  const storage = getStorage(app);
  const path = `resumes/${userId}/${Date.now()}_${file.name}`;
  const ref = storageRef(storage, path);
  const uploadTask = uploadBytesResumable(ref, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.totalBytes
          ? snapshot.bytesTransferred / snapshot.totalBytes
          : 0;
        try {
          onProgress(progress);
        } catch (_) {}
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}
