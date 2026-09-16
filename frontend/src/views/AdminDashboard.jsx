import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Users, Wrench, AlertCircle } from 'lucide-react';

const serviceImages = {
  water: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=85',
  electricity: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=85',
  painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=85',
  mason: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=700&q=85'
};
const getServiceImage = (name = '') => Object.entries(serviceImages).find(([key]) => name.toLowerCase().includes(key))?.[1];
const formatDateDay = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Date not selected';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, workers: 0, requests: 0, complaints: 0 });
  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [activePanel, setActivePanel] = useState('requests');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const detailPanelRef = useRef(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [statsRes, reqsRes, workersRes, complaintsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/overview`, { headers }),
        axios.get(`${API_URL}/api/admin/requests`, { headers }),
        axios.get(`${API_URL}/api/admin/workers`, { headers }),
        axios.get(`${API_URL}/api/complaints`, { headers }),
        axios.get(`${API_URL}/api/admin/users`, { headers })
      ]);
      setStats(statsRes.data);
      setRequests(reqsRes.data);
      setWorkers(workersRes.data);
      setComplaints(complaintsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showPanel = (panel) => {
    setActivePanel(panel);
    setShowDetailModal(true);
    window.setTimeout(() => detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const assignWorker = async (reqId, workerId) => {
    if (!workerId) return;
    try {
      await axios.put(`${API_URL}/api/admin/requests/${reqId}/assign`, { worker_id: workerId }, { headers });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/complaints/${id}/resolve`, {}, { headers });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderModalContent = () => {
    if (activePanel === 'users') {
      return users.length ? <div className="admin-modal-list">{users.map(user => (
        <div className="admin-modal-item" key={user.id}>
          <strong>User ID: #{user.id}</strong><span>{user.name}</span><span>{user.email}</span><a href={`tel:${user.phone}`}>{user.phone}</a>
        </div>
      ))}</div> : <p className="text-secondary">No residents found.</p>;
    }
    if (activePanel === 'workers') {
      return workers.length ? <div className="admin-modal-list">{workers.map(worker => (
        <div className="admin-modal-item" key={worker.id}>
          <strong>Worker ID: #{worker.id}</strong><span>{worker.name}</span><span>{worker.specialization}</span><a href={`tel:${worker.phone}`}>{worker.phone}</a><span>{worker.status}</span>
        </div>
      ))}</div> : <p className="text-secondary">No workers found.</p>;
    }
    if (activePanel === 'requests') {
      return requests.length ? <div className="admin-modal-list">{requests.map(request => (
        <div className="admin-modal-item" key={request.id}>
          <strong>Request ID: #{request.id} · {request.service_name}</strong><span>Resident: {request.resident_name} (User ID: #{request.user_id})</span><span>Flat: {request.flat_number}</span><span>Date: {formatDateDay(request.preferred_date)}</span><span>Time: {request.preferred_time_slot || 'Not selected'}</span><span>Status: {request.status}</span><span>Worker: {request.worker_name || 'Unassigned'}</span>
        </div>
      ))}</div> : <p className="text-secondary">No service requests found.</p>;
    }
    return complaints.length ? <div className="admin-modal-list">{complaints.map(complaint => (
      <div className="admin-modal-item" key={complaint.id}>
        <strong>Complaint #{complaint.id}: {complaint.subject}</strong><span>Resident: {complaint.resident_name}</span><span>Date: {formatDateDay(complaint.complaint_date)}</span><span>{complaint.message}</span><span>Worker: {complaint.worker_name || 'Not specified'}</span><span>Status: {complaint.status}</span>
      </div>
    ))}</div> : <p className="text-secondary">No complaints found.</p>;
  };

  return (
    <div className="animate-slide-up">
      <div className="header-flex">
        <div>
          <h1 className="text-gradient">Admin Dashboard</h1>
          <p className="text-secondary">System Overview and Management</p>
        </div>
      </div>

      <div className="grid grid-cols-4 admin-overview-cards" style={{ marginBottom: '32px' }}>
        <button type="button" className={`glass-card overview-card ${activePanel === 'users' ? 'active' : ''}`} onClick={() => showPanel('users')}>
          <Users size={32} className="text-accent" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.users}</h2>
          <p className="text-secondary">Total Residents</p>
        </button>
        <button type="button" className={`glass-card overview-card ${activePanel === 'workers' ? 'active' : ''}`} onClick={() => showPanel('workers')}>
          <Wrench size={32} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.workers}</h2>
          <p className="text-secondary">Total Workers</p>
        </button>
        <button type="button" className={`glass-card overview-card ${activePanel === 'requests' ? 'active' : ''}`} onClick={() => showPanel('requests')}>
          <AlertCircle size={32} style={{ color: 'var(--warning)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.requests}</h2>
          <p className="text-secondary">Service Requests</p>
        </button>
        <button type="button" className={`glass-card overview-card ${activePanel === 'complaints' ? 'active' : ''}`} onClick={() => showPanel('complaints')}>
          <AlertCircle size={32} style={{ color: 'var(--danger)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.complaints}</h2>
          <p className="text-secondary">Complaints</p>
        </button>
      </div>

      {showDetailModal && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label={`${activePanel} details`}>
          <div className="glass-card admin-modal">
            <div className="panel-heading-row">
              <h2>{activePanel === 'users' ? 'All Residents' : activePanel === 'workers' ? 'All Workers' : activePanel === 'requests' ? 'Service Requests' : 'Complaints'}</h2>
              <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}

      <div ref={detailPanelRef} className="admin-detail-anchor">
      {activePanel === 'users' && (
        <div className="glass-card admin-detail-panel">
          <h3>All Residents</h3>
          {users.length === 0 ? <p className="text-secondary">No residents found.</p> : <table className="data-table"><thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead><tbody>
            {users.map(user => <tr key={user.id}><td>#{user.id}</td><td>{user.name}</td><td>{user.email}</td><td>{user.phone}</td></tr>)}
          </tbody></table>}
        </div>
      )}
      {activePanel === 'workers' && (
        <div className="glass-card admin-detail-panel">
          <h3>All Workers</h3>
          {workers.length === 0 ? <p className="text-secondary">No workers found.</p> : <table className="data-table"><thead><tr><th>Worker ID</th><th>Name</th><th>Specialization</th><th>Phone</th><th>Status</th></tr></thead><tbody>
            {workers.map(worker => <tr key={worker.id}><td>#{worker.id}</td><td>{worker.name}</td><td>{worker.specialization}</td><td><a href={`tel:${worker.phone}`}>{worker.phone}</a></td><td>{worker.status}</td></tr>)}
          </tbody></table>}
        </div>
      )}
      {activePanel === 'requests' && <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '20px' }}>Service Requests</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Service / ID</th>
              <th>Resident / User ID</th>
              <th>Flat</th>
              <th>Visit Time</th>
              <th>Status</th>
              <th>Assigned To / Worker ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td><span className="request-service-cell"><img src={getServiceImage(r.service_name)} alt="" />{r.service_name}</span><small className="table-subtext">Service ID: #{r.service_id}<br />{r.description}</small></td>
                <td><span>{r.resident_name}</span><small className="table-subtext">User ID: #{r.user_id}</small></td>
                <td>{r.flat_number}</td>
                <td><span className="time-slot-badge">{r.preferred_time_slot || 'Not selected'}</span></td>
                <td><span className={`badge badge-${r.status.toLowerCase().replace(' ', '-')}`}>{r.status}</span></td>
                <td>{r.worker_name ? <><span>{r.worker_name}</span><small className="table-subtext">Worker ID: #{r.worker_id}</small></> : 'Unassigned'}</td>
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
            {requests.length === 0 && <tr><td colSpan="7" className="admin-empty-cell">No service requests found.</td></tr>}
          </tbody>
        </table>
      </div>}

      {activePanel === 'complaints' && <div className="glass-card">
        <h3 style={{ marginBottom: '20px' }}>Recent Complaints</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Resident</th>
              <th>Message</th>
              <th>Worker / ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td><strong>{c.subject}</strong></td>
                <td><span>{c.resident_name}</span><small className="table-subtext">{c.resident_email}</small></td>
                <td style={{ maxWidth: '300px' }}>{c.message}</td>
                <td>{c.worker_name ? <span className="worker-contact"><strong>{c.worker_name}</strong><small className="table-subtext">Worker ID: #{c.worker_id}</small><a href={`tel:${c.worker_phone}`}>{c.worker_phone}</a></span> : 'Not specified'}</td>
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
            {complaints.length === 0 && <tr><td colSpan="6" className="admin-empty-cell">No complaints found.</td></tr>}
          </tbody>
        </table>
      </div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
