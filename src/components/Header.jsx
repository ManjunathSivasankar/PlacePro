import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

export default function Header() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header>
      <nav className="container">
        <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold' }}>
          🎓 PlacePro
        </Link>

        <div>
          {currentUser ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span>{currentUser.email}</span>
              {userRole === 'admin' && <Link to="/admin">Dashboard</Link>}
              {userRole === 'student' && <Link to="/student">My Dashboard</Link>}
              {userRole === 'student' && <Link to="/jobs">Jobs</Link>}
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-success">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
