import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, KeyRound } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'user', specialization: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      setSuccess('Registration successful! You can now login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-slide-up">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Create Account</h1>
          <p className="text-secondary">Join FlatCare to manage your residence</p>
        </div>

        {error && <div className="badge badge-pending" style={{ display: 'block', padding: '12px', marginBottom: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>{error}</div>}
        {success && <div className="badge badge-progress" style={{ display: 'block', padding: '12px', marginBottom: '20px', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Register As</label>
            <select 
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">Resident</option>
              <option value="worker">Maintenance Worker</option>
            </select>
          </div>

          {formData.role === 'worker' && (
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <select 
                className="form-select"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              >
                <option value="">Select your skill...</option>
                <option value="Water Service">Water Service</option>
                <option value="Electricity Service">Electricity Service</option>
                <option value="Painting Service">Painting Service</option>
                <option value="Mason Service">Mason Service</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
              <input type="text" className="form-input" style={{ paddingLeft: '48px' }} required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
              <input type="email" className="form-input" style={{ paddingLeft: '48px' }} required
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
              <input type="tel" className="form-input" style={{ paddingLeft: '48px' }} required
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
              <input type="password" className="form-input" style={{ paddingLeft: '48px' }} required
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="text-accent" style={{ textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
