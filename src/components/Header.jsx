import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

export default function Header() {
  const { currentUser, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      <nav className="container">
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "800",
            letterSpacing: "-0.025em",
          }}
        >
          🎓 <span style={{ color: "var(--primary)" }}>Place</span>Pro
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${isMenuOpen ? "show" : ""}`}>
          {currentUser ? (
            <>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {currentUser.email}
              </span>
              {userRole === "admin" && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              {userRole === "student" && (
                <Link to="/student" onClick={() => setIsMenuOpen(false)}>
                  My Dashboard
                </Link>
              )}
              {userRole === "student" && (
                <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>
                  Jobs
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn"
                style={{ color: "var(--text-main)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
