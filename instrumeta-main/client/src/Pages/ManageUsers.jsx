import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start py-5"
      style={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div
        className="card shadow border-0 rounded-4 w-100 mx-4"
        style={{
          backgroundColor: '#d0a9f5',
          maxWidth: '1000px',
          color: '#121212',
        }}
      >
        <div className="card-body p-4">
          <h2 className="mb-4 fw-bold text-center">Manage Users</h2>

          {loading ? (
            <p className="text-center">Loading users...</p>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : users.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-bordered table-striped">
                <thead className="table-dark text-white">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn"
                          style={{
                            backgroundColor: '#121212',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            transition: 'background-color 0.3s'
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#2a2a2a')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#121212')}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;