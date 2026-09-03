import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Wrench, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, workers: 0, requests: 0, complaints: 0 });
  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [statsRes, reqsRes, workersRes, complaintsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/overview', { headers }),
        axios.get('http://localhost:5000/api/admin/requests', { headers }),
        axios.get('http://localhost:5000/api/admin/workers', { headers }),
        axios.get('http://localhost:5000/api/complaints', { headers })
      ]);
      setStats(statsRes.data);
      setRequests(reqsRes.data);
      setWorkers(workersRes.data);
      setComplaints(complaintsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const assignWorker = async (reqId, workerId) => {
    if (!workerId) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/requests/${reqId}/assign`, { worker_id: workerId }, { headers });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/complaints/${id}/resolve`, {}, { headers });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="header-flex">
        <div>
          <h1 className="text-gradient">Admin Dashboard</h1>
          <p className="text-secondary">System Overview and Management</p>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '32px' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <Users size={32} className="text-accent" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.users}</h2>
          <p className="text-secondary">Total Residents</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <Wrench size={32} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.workers}</h2>
          <p className="text-secondary">Total Workers</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <AlertCircle size={32} style={{ color: 'var(--warning)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.requests}</h2>
          <p className="text-secondary">Service Requests</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <AlertCircle size={32} style={{ color: 'var(--danger)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.complaints}</h2>
          <p className="text-secondary">Complaints</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '20px' }}>Service Requests</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Resident</th>
              <th>Flat</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.service_name}</td>
                <td>{r.resident_name}</td>
                <td>{r.flat_number}</td>
                <td><span className={`badge badge-${r.status.toLowerCase().replace(' ', '-')}`}>{r.status}</span></td>
                <td>{r.worker_name || 'Unassigned'}</td>
                <td>
                  {r.status === 'Pending' && (
                    <select className="form-select" style={{ padding: '6px', fontSize: '0.9rem' }} 
                            onChange={(e) => assignWorker(r.id, e.target.value)} defaultValue="">
                      <option value="" disabled>Assign Worker...</option>
                      {workers.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({w.specialization})</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '20px' }}>Recent Complaints</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td>{c.subject}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.message}</td>
                <td><span className={`badge badge-${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                <td>
                  {c.status === 'Open' && (
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => resolveComplaint(c.id)}>
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
