import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, Mail } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (res.data.user.role === 'user') navigate('/resident');
      else if (res.data.user.role === 'worker') navigate('/worker');
      else if (res.data.user.role === 'admin') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-slide-up">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Welcome Back</h1>
          <p className="text-secondary">Sign in to manage your flats and requests</p>
        </div>

        {error && <div className="badge badge-pending" style={{ display: 'block', padding: '12px', marginBottom: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Role</label>
            <select 
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">Resident</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '48px' }}
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '48px' }}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" className="text-accent" style={{ textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
