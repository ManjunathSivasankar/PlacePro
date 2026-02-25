import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { currentUser, userRole } = useAuth();

  return (
    <div className="animate-fade-in">
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Your Future, <br />
            Simplified.
          </h1>
          <p className="hero-subtitle">
            Welcome to <strong>PlacePro</strong>. The unified placement portal
            for simplified recruitment and professional growth.
          </p>
          <div className="btn-section" style={{ justifyContent: "center" }}>
            {currentUser ? (
              <Link
                to={userRole === "admin" ? "/admin" : "/student"}
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Get Started
                </Link>
                <Link
                  to="/signup"
                  className="btn"
                  style={{ border: "1px solid #e2e8f0" }}
                >
                  Join as Recruiter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features-section" style={{ background: "white" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "4rem" }}>
            Why Choose PlacePro?
          </h2>
          <div className="feature-grid">
            <div className="feature-card glass-card">
              <span className="feature-icon">🚀</span>
              <h3>For Students</h3>
              <p className="text-muted">
                Explore live opportunities from top recruiters, track your
                applications real-time, and securely upload your resume directly
                to our platform.
              </p>
            </div>
            <div className="feature-card glass-card">
              <span className="feature-icon">💼</span>
              <h3>For Recruiters</h3>
              <p className="text-muted">
                Post placement drives in seconds, manage applicants through a
                streamlined funnel, and view candidate resumes with a single
                click.
              </p>
            </div>
            <div className="feature-card glass-card">
              <span className="feature-icon">🛡️</span>
              <h3>Built-in Security</h3>
              <p className="text-muted">
                Encrypted resume storage and secure authentication ensure that
                your professional data is always protected and accessible only
                to authorized personnel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="container"
        style={{ padding: "6rem 1.5rem", textAlign: "center" }}
      >
        <div className="card glass-card" style={{ padding: "4rem" }}>
          <h2>Ready to transform your career path?</h2>
          <p className="text-muted" style={{ marginBottom: "2rem" }}>
            Join hundreds of students and recruiters already using PlacePro to
            bridge the gap between education and industry.
          </p>
          {!currentUser && (
            <Link to="/signup" className="btn btn-primary">
              Create Your Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
