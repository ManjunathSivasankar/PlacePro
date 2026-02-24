import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllJobs, subscribeToAllJobs } from "../services/jobService";
import {
  checkDuplicateApplication,
  uploadResume,
  submitApplication,
} from "../services/applicationService";
import { getFeaturedJobs } from "../services/demoService";
import ApplicationModal from "../components/ApplicationModal";

export default function JobList() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    // Set featured jobs once
    setFeaturedJobs(getFeaturedJobs());

    // Subscribe to live jobs real-time
    const unsubscribe = subscribeToAllJobs((liveJobs) => {
      setJobs(liveJobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApplyClick = async (job) => {
    if (job.id.startsWith("demo-")) {
      alert(
        "This is a demo job for exploration. Please apply to 'Live' jobs posted by recruiters.",
      );
      return;
    }

    try {
      const isDuplicate = await checkDuplicateApplication(
        job.id,
        currentUser.uid,
      );
      if (isDuplicate) {
        setError("You have already applied for this job");
        return;
      }
      setSelectedJob(job);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitApplication = async () => {
    if (!resumeFile) {
      setError("Please select a resume");
      return;
    }

    try {
      setApplying(true);
      setError("");

      // Upload resume
      const downloadURL = await uploadResume(resumeFile, currentUser.uid);

      // Submit application
      await submitApplication(
        selectedJob.id,
        currentUser.uid,
        downloadURL,
        currentUser.displayName || currentUser.email,
      );

      setSuccess("Application submitted successfully!");
      setShowModal(false);
      setSelectedJob(null);
      setResumeFile(null);

      // Refresh jobs
      fetchJobs();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading">Fetching Opportunities...</div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Placement Portal</h1>
        <p>Explore live jobs and industry recommendations</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Recommended Jobs */}
      <section style={{ marginBottom: "50px" }}>
        <h2 style={{ marginBottom: "20px" }}>⭐ Recommended for You</h2>
        <div className="grid">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="card job-card glass-card"
              style={{ borderLeftColor: "#ffc107" }}
            >
              <span
                className="status-badge status-selected"
                style={{ marginBottom: "10px" }}
              >
                Featured
              </span>
              <h3>{job.title}</h3>
              <p className="job-description">{job.description}</p>
              <div className="job-meta">
                <div className="meta-item">
                  <label>Location</label>
                  <span>{job.location}</span>
                </div>
              </div>
              <button
                onClick={() => handleApplyClick(job)}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  marginTop: "15px",
                  background: "#ffc107",
                  color: "#000",
                }}
              >
                Explore Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Live Jobs */}
      <section>
        <h2 style={{ marginBottom: "20px" }}>🎯 Live Placement Drives</h2>
        {jobs.length === 0 ? (
          <div className="empty-state card glass-card">
            <div className="empty-state-icon">💼</div>
            <h3>No Live Jobs Yet</h3>
            <p>
              Recruiters are currently preparing new drives. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid">
            {jobs.map((job) => (
              <div key={job.id} className="card job-card glass-card">
                <span
                  className="status-badge status-applied"
                  style={{ marginBottom: "10px" }}
                >
                  Live
                </span>
                <h3>{job.title}</h3>
                <p className="job-description">{job.description}</p>
                <div className="job-meta">
                  <div className="meta-item">
                    <label>Location</label>
                    <span>{job.location}</span>
                  </div>
                  <div className="meta-item">
                    <label>Deadline</label>
                    <span>
                      {job.lastDate
                        ? new Date(
                            job.lastDate.seconds * 1000,
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyClick(job)}
                  className="btn btn-success"
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showModal && selectedJob && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => {
            setShowModal(false);
            setSelectedJob(null);
            setResumeFile(null);
          }}
          onSubmit={handleSubmitApplication}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          applying={applying}
        />
      )}
    </div>
  );
}
