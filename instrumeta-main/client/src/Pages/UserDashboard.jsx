import React from 'react';

const UserDashboard = ({ username }) => {
  const displayName = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : 'User';

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">
        Welcome, {displayName}!
      </h2>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <h5 className="card-title">👤 Profile</h5>
              <p className="card-text">
                View and update your personal information and preferences.
              </p>
              <button className="btn btn-outline-primary w-100">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <h5 className="card-title">⚙️ Settings</h5>
              <p className="card-text">
                Customize your dashboard experience and application settings.
              </p>
              <button className="btn btn-outline-secondary w-100">
                Go to Settings
              </button>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-body">
              <h5 className="card-title">📊 Activity</h5>
              <p className="card-text">
                Check your recent actions, logs, and history in the system.
              </p>
              <button className="btn btn-outline-success w-100">
                View Activity
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center text-muted">
        <small>More features coming soon!</small>
      </div>
    </div>
  );
};

export default UserDashboard;
