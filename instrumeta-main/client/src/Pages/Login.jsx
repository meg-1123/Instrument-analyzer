import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setAuth, setUsername, setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (res.data && res.data.user) {
        setAuth(true);
        setUsername(res.data.user.username);
        setRole(res.data.user.role);

        if (res.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#121212' }}
    >
      <div
        className="card shadow border-0 rounded-4"
        style={{
          backgroundColor: '#d0a9f5',
          width: '100%',
          maxWidth: '400px',
          color: '#121212',
        }}
      >
        <div className="card-body p-4">
          <h2 className="text-center mb-4 fw-bold">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control bg-light border-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control bg-light border-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 mb-3"
              style={{ fontWeight: 'bold' }}
            >
              Login
            </button>

            <Link to="/" className="btn btn-outline-dark w-100">
              ⬅ Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
