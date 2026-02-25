import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobsByAdmin, subscribeToAdminJobs } from "../services/jobService";
import {
  getApplicationsForJob,
  updateApplicationStatus,
  openResume,
} from "../services/applicationService";
import { getRandomAvatar } from "../services/demoService";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [funnelData, setFunnelData] = useState({
    total: 0,
    applied: 0,
    selected: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to admin-specific jobs real-time
    const unsubscribe = subscribeToAdminJobs(
      currentUser.uid,
      async (adminJobs) => {
        try {
          // Fetch application counts for funnel
          let totalApplied = 0;
          let totalSelected = 0;
          const jobsWithCounts = [];

          for (const job of adminJobs) {
            const apps = await getApplicationsForJob(job.id);
            totalApplied += apps.length;
            totalSelected += apps.filter((a) => a.status === "selected").length;
            jobsWithCounts.push({ ...job, appCount: apps.length });
          }

          setJobs(jobsWithCounts);
          setFunnelData({
            total: adminJobs.length,
            applied: totalApplied,
            selected: totalSelected,
          });
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app,
        ),
      );
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewApplications = async (jobId) => {
    try {
      const apps = await getApplicationsForJob(jobId);
      setApplications(apps);
      setSelectedJobId(jobId);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Generating Insights...</div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="profile-card">
        <img
          src={getRandomAvatar(currentUser.uid)}
          alt="Admin Avatar"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>Admin Command Center</h2>
          <p>{currentUser.email} • Recruiter</p>
        </div>
      </div>

      <div className="page-header">
        <h1>Placement Funnel</h1>
        <p>Overall recruitment performance across your drives</p>
      </div>

      <div className="funnel-container">
        <div
          className="funnel-stage"
          style={{ width: "100%", background: "#4dabf7" }}
        >
          Jobs Posted: {funnelData.total}
        </div>
        <div
          className="funnel-stage"
          style={{
            width: `${Math.min(100, (funnelData.applied / 10) * 100)}%`,
            background: "#339af0",
          }}
        >
          Total Applications: {funnelData.applied}
        </div>
        <div
          className="funnel-stage"
          style={{
            width: `${Math.min(100, (funnelData.selected / 5) * 100)}%`,
            background: "#228be6",
          }}
        >
          Candidates Recruited: {funnelData.selected}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="btn-section" style={{ marginBottom: "30px" }}>
        <Link to="/create-job" className="btn btn-success">
          + Start New Placement Drive
        </Link>
      </div>

      <h2>Your Active Drives</h2>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs posted yet. Create your first placement drive!</p>
        </div>
      ) : (
        <div className="grid">
          {jobs.map((job) => (
            <div key={job.id} className="card job-card glass-card">
              <h3>{job.title}</h3>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p style={{ marginTop: "10px" }}>
                <span className="status-badge status-applied">
                  {job.appCount || 0} Applicants
                </span>
              </p>
              <div className="btn-group" style={{ marginTop: "15px" }}>
                <Link to={`/edit-job/${job.id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button
                  onClick={() => handleViewApplications(job.id)}
                  className="btn btn-primary"
                >
                  View Apps
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJobId && (
        <div
          className="card glass-card animate-fade-in"
          style={{ marginTop: "40px" }}
        >
          <h2>Manage Applicants</h2>
          {applications.length === 0 ? (
            <p className="empty-state">No applications found for this job.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Resume</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.userName}</td>
                    <td>
                      {app.resumeUrl ? (
                        <button
                          onClick={() => openResume(app.resumeUrl)}
                          className="btn btn-primary"
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          View Resume
                        </button>
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          No Resume
                        </span>
                      )}
                    </td>
                    <td>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        className="btn"
                        style={{ padding: "5px", fontSize: "12px" }}
                      >
                        <option value="applied">Applied</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
