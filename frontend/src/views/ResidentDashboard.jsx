import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Home, Wrench } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const serviceImages = {
  water: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=85',
  electricity: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=85',
  painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=85',
  mason: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=700&q=85'
};

const getServiceImage = (name = '') => {
  const key = name.toLowerCase();
  return Object.entries(serviceImages).find(([service]) => key.includes(service))?.[1]
    || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=700&q=85';
};

const ResidentDashboard = () => {
  const [flats, setFlats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [showAddFlat, setShowAddFlat] = useState(false);
  const [showAddRequest, setShowAddRequest] = useState(false);
  
  const [newFlat, setNewFlat] = useState({ flat_number: '', floor_number: '', block_name: '', address: '' });
  const [newReq, setNewReq] = useState({ flat_id: '', service_id: '', description: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [flatsRes, reqsRes, srvsRes] = await Promise.all([
        axios.get(`${API_URL}/api/flats`, { headers }),
        axios.get(`${API_URL}/api/requests`, { headers }),
        axios.get(`${API_URL}/api/services`, { headers })
      ]);
      setFlats(flatsRes.data);
      setRequests(reqsRes.data);
      setServices(srvsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddFlat = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/api/flats`, newFlat, { headers });
    setShowAddFlat(false);
    fetchData();
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/api/requests`, newReq, { headers });
    setShowAddRequest(false);
    fetchData();
  };

  return (
    <div className="animate-slide-up">
      <div className="header-flex">
        <div>
          <h1 className="text-gradient">Resident Portal</h1>
          <p className="text-secondary">Manage your properties and requests</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setShowAddFlat(true)}><Plus size={18}/> Add Flat</button>
          <button className="btn btn-primary" onClick={() => setShowAddRequest(true)}><Wrench size={18}/> New Request</button>
        </div>
      </div>

      {showAddFlat && (
        <div className="glass-card" style={{ marginBottom: '32px' }}>
          <h3>Register New Flat</h3>
          <form onSubmit={handleAddFlat} style={{ marginTop: '16px' }} className="grid grid-cols-2">
            <input className="form-input" placeholder="Flat Number" required value={newFlat.flat_number} onChange={e => setNewFlat({...newFlat, flat_number: e.target.value})} />
            <input className="form-input" placeholder="Floor Number" required value={newFlat.floor_number} onChange={e => setNewFlat({...newFlat, floor_number: e.target.value})} />
            <input className="form-input" placeholder="Block Name" required value={newFlat.block_name} onChange={e => setNewFlat({...newFlat, block_name: e.target.value})} />
            <input className="form-input" placeholder="Address" required value={newFlat.address} onChange={e => setNewFlat({...newFlat, address: e.target.value})} />
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddFlat(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Flat</button>
            </div>
          </form>
        </div>
      )}

      {showAddRequest && (
        <div className="glass-card" style={{ marginBottom: '32px' }}>
          <h3>New Service Request</h3>
          <img
            className="fault-report-image"
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=85"
            alt="Maintenance worker repairing a home fault"
          />
          <form onSubmit={handleAddRequest} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <select className="form-select" required value={newReq.flat_id} onChange={e => setNewReq({...newReq, flat_id: e.target.value})}>
              <option value="">Select Flat...</option>
              {flats.map(f => <option key={f.id} value={f.id}>{f.flat_number} - {f.block_name}</option>)}
            </select>
            <select className="form-select" required value={newReq.service_id} onChange={e => setNewReq({...newReq, service_id: e.target.value})}>
              <option value="">Select Service Type...</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <textarea className="form-textarea" placeholder="Describe the issue..." required value={newReq.description} onChange={e => setNewReq({...newReq, description: e.target.value})} rows="3"></textarea>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddRequest(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      <section className="service-gallery" aria-label="Available maintenance services">
        <div className="service-gallery-heading">
          <div>
            <h3>Maintenance Services</h3>
            <p className="text-secondary">Choose a service when your home needs attention.</p>
          </div>
        </div>
        <div className="service-gallery-grid">
          {services.map(service => (
            <button
              type="button"
              className="service-image-card"
              key={service.id}
              onClick={() => {
                setNewReq({ ...newReq, service_id: String(service.id) });
                setShowAddRequest(true);
              }}
            >
              <img src={getServiceImage(service.name)} alt={`${service.name} service`} />
              <span>{service.name}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 resident-overview">
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Home className="text-accent" /> My Flats
          </h3>
          {flats.length === 0 ? <p className="text-secondary">No flats added yet.</p> : (
            <div className="grid">
              {flats.map(f => (
                <div key={f.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <img
                    className="flat-property-image"
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=85"
                    alt="Apartment building"
                  />
                  <h4>{f.flat_number} - {f.block_name}</h4>
                  <p className="text-secondary" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Floor {f.floor_number}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Wrench className="text-accent" /> Recent Requests
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Flat</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.service_name}</td>
                  <td>{r.flat_number}</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase().replace(' ', '-')}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
