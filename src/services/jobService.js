import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const JOBS_COLLECTION = "jobs";

// Create Job (Admin only)
export const createJob = async (jobData, adminUid) => {
  try {
    const newJob = {
      ...jobData,
      postedBy: adminUid,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, JOBS_COLLECTION), newJob);
    return { id: docRef.id, ...newJob };
  } catch (error) {
    throw new Error(`Error creating job: ${error.message}`);
  }
};

// Get all jobs
export const getAllJobs = async () => {
  try {
    const q = query(collection(db, JOBS_COLLECTION));
    const querySnapshot = await getDocs(q);

    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory to avoid index requirements
    return jobs.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
  } catch (error) {
    throw new Error(`Error fetching jobs: ${error.message}`);
  }
};

// Get single job
export const getJob = async (jobId) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    const jobSnap = await getDoc(jobRef);

    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    }

    throw new Error("Job not found");
  } catch (error) {
    throw new Error(`Error fetching job: ${error.message}`);
  }
};

// Update job (Admin only)
export const updateJob = async (jobId, updatedData) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, updatedData);
    return await getJob(jobId);
  } catch (error) {
    throw new Error(`Error updating job: ${error.message}`);
  }
};

// Delete job (Admin only)
export const deleteJob = async (jobId) => {
  try {
    await deleteDoc(doc(db, JOBS_COLLECTION, jobId));
  } catch (error) {
    throw new Error(`Error deleting job: ${error.message}`);
  }
};

// Get jobs posted by admin
export const getJobsByAdmin = async (adminUid) => {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where("postedBy", "==", adminUid),
    );
    const querySnapshot = await getDocs(q);

    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory to avoid index requirements
    return jobs.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
  } catch (error) {
    throw new Error(`Error fetching admin jobs: ${error.message}`);
  }
};

// Subscribe to all jobs (Real-time)
export const subscribeToAllJobs = (callback) => {
  const q = query(collection(db, JOBS_COLLECTION));

  return onSnapshot(
    q,
    (snapshot) => {
      const jobs = [];
      snapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });

      // Sort in memory
      const sortedJobs = jobs.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      callback(sortedJobs);
    },
    (error) => {
      console.error("Jobs subscription error:", error);
    },
  );
};

// Subscribe to admin-specific jobs (Real-time)
export const subscribeToAdminJobs = (adminUid, callback) => {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where("postedBy", "==", adminUid),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const jobs = [];
      snapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });

      // Sort in memory
      const sortedJobs = jobs.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      callback(sortedJobs);
    },
    (error) => {
      console.error("Admin jobs subscription error:", error);
    },
  );
};
