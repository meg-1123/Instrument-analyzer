import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = ({ setAuth, setUsername, setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const username = email.split('@')[0];

      const res = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password,
      });

      if (res.data && res.data.user) {
        setAuth(true);
        setUsername(res.data.user.username);
        setRole(res.data.user.role);
        navigate('/dashboard');
      } else if (res.data && res.data.message) {
        setAuth(true);
        setUsername(username);
        setRole('user');
        navigate('/dashboard');
      } else {
        alert('Registration failed: Unexpected response from server');
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
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
          <h2 className="text-center mb-4 fw-bold">Signup</h2>
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
                placeholder="Enter a password"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control bg-light border-dark"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter the password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 mb-3"
              style={{ fontWeight: 'bold' }}
            >
              Create Account
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

export default Signup;
