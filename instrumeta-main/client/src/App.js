// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Pages/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import UserDashboard from './Pages/UserDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import VirtualInstruments from './Pages/VirtualInstruments';
import AnalyzeMusic from './Pages/AnalyzeMusic';
import ManageUsers from './Pages/ManageUsers';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(''); // NEW

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setRole('');
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} username={username} role={role} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} setUsername={setUsername} setRole={setRole} />} />
        <Route path="/signup" element={<Signup setAuth={setIsAuthenticated} setUsername={setUsername} setRole={setRole} />} />
        <Route path="/dashboard" element={<UserDashboard username={username} />} />
        <Route path="/analyze" element={<AnalyzeMusic/>} />
        <Route path="/virtual-instruments" element={<VirtualInstruments/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-users" element={<ManageUsers/>}/>
      </Routes>
    </Router>
  );
}

export default App;
