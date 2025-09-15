import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, username, role, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{ color: '#d0a9f5' }}>
          🎵 InstruMeta
        </Link>

        <div className="collapse navbar-collapse">
          {isAuthenticated ? (
            <ul className="navbar-nav ms-auto align-items-center">
              {role === 'admin' ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-light" to="/manage-users">Manage Users</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-light" to="/admin-dashboard">Admin</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-light" to="/analyze">Analyze Music</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-light" to="/virtual-instruments">Virtual Instruments</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold" style={{ color: '#d0a9f5' }} to="/dashboard">
                      {username}
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/signup">Signup</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

