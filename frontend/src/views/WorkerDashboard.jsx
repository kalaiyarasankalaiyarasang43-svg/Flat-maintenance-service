import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle } from 'lucide-react';

const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/workers/requests', { headers });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/workers/requests/${id}`, { status }, { headers });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const claimTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/workers/requests/${id}/claim`, {}, { headers });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="header-flex">
        <div>
          <h1 className="text-gradient">Worker Portal</h1>
          <p className="text-secondary">View and manage your assigned tasks</p>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Wrench className="text-accent" /> Available & Assigned Tasks
        </h3>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Flat</th>
              <th>Resident</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.service_name}</td>
                <td>{r.flat_number} ({r.block_name})</td>
                <td>{r.resident_name}</td>
                <td>{r.resident_phone}</td>
                <td>
                  <span className={`badge badge-${r.status.toLowerCase().replace(' ', '-')}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === 'Pending' && (
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--accent-primary)', color: 'white' }}
                      onClick={() => claimTask(r.id)}>
                      Claim Task
                    </button>
                  )}
                  {r.status === 'Assigned' && (
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => updateStatus(r.id, 'In Progress')}>
                      Start Work
                    </button>
                  )}
                  {r.status === 'In Progress' && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => updateStatus(r.id, 'Completed')}>
                      <CheckCircle size={14} /> Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No available or assigned tasks.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerDashboard;
