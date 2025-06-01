import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      email === import.meta.env.VITE_CNBADMIN_USER &&
      password === import.meta.env.VITE_CNBADMIN_PASSWORD
    ) {
      sessionStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } else {
      alert('Incorrect email or password.');
    }
  };

  return (
    <div className="admin-login">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;