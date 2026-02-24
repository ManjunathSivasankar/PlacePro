import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getApplicationsByStudent,
  deleteApplication,
} from "../services/applicationService";
import { getAllJobs } from "../services/jobService";
import {
  getRandomAvatar,
  getCareerTip,
  getAnnouncements,
} from "../services/demoService";

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [careerTip, setCareerTip] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    selected: 0,
    rejected: 0,
    applied: 0,
  });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apps, allJobs, tip, alerts] = await Promise.all([
        getApplicationsByStudent(currentUser.uid),
        getAllJobs(),
        getCareerTip(),
        getAnnouncements(),
      ]);

      setApplications(apps);
      setJobs(allJobs);
      setCareerTip(tip);
      setAnnouncements(alerts);

      setStats({
        total: apps.length,
        selected: apps.filter((a) => a.status === "selected").length,
        rejected: apps.filter((a) => a.status === "rejected").length,
        applied: apps.filter((a) => a.status === "applied").length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = () => {
    if (stats.selected > 0) return 3;
    if (stats.total > 0) return 2;
    return 1;
  };

  if (loading) return <div className="loading">Initializing Dashboard...</div>;

  return (
    <div className="page-container animate-fade-in">
      {/* Profile Section */}
      <div className="profile-card">
        <img
          src={getRandomAvatar(currentUser.uid)}
          alt="Avatar"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>Welcome back, {currentUser.displayName || "Student"}!</h2>
          <p>
            {currentUser.email} •{" "}
            {currentUser.userRole?.toUpperCase() || "STUDENT"}
          </p>
        </div>
      </div>

      {/* Career Tip */}
      <div className="tip-card">
        <strong>💡 Tip of the day:</strong> {careerTip}
      </div>

      <div className="page-header">
        <h1>My Placement Journey</h1>
        <p>Your current status in the recruitment cycle</p>
      </div>

      {/* Progress Stepper */}
      <div className="progress-stepper">
        <div className={`step ${getStepStatus() >= 1 ? "completed" : ""}`}>
          <div className="step-circle">1</div>
          <div className="step-label">Profile Setup</div>
        </div>
        <div
          className={`step ${getStepStatus() >= 2 ? "completed" : "active"}`}
        >
          <div className="step-circle">2</div>
          <div className="step-label">Applied</div>
        </div>
        <div className={`step ${getStepStatus() >= 3 ? "completed" : ""}`}>
          <div className="step-circle">3</div>
          <div className="step-label">Recruited!</div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="dashboard-grid">
        <div className="stat-card applications">
          <h3>Applications</h3>
          <div className="number">{stats.total}</div>
        </div>
        <div className="stat-card selected">
          <h3>Selected</h3>
          <div className="number">{stats.selected}</div>
        </div>
        <div className="stat-card jobs">
          <h3>Pending</h3>
          <div className="number">{stats.applied}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/jobs"
          className="btn btn-primary"
          style={{ flex: 1, textAlign: "center" }}
        >
          Explore New Jobs
        </a>
      </div>

      <div className="grid">
        <div className="card glass-card">
          <h2>Latest Announcements</h2>
          <div style={{ marginTop: "15px" }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                <h4 style={{ color: "#007bff" }}>{ann.title}</h4>
                <small style={{ color: "#999" }}>{ann.date}</small>
                <p style={{ fontSize: "14px", marginTop: "5px" }}>{ann.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card glass-card">
          <h2>Active Applications</h2>
          {applications.length === 0 ? (
            <div className="empty-state">
              <p>No applications yet. Start applying today!</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  return (
                    <tr key={app.id}>
                      <td>{job?.title || "Job Deleted"}</td>
                      <td>
                        <span className={`status-badge status-${app.status}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.createdAt
                          ? new Date(
                              app.createdAt.seconds * 1000,
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
