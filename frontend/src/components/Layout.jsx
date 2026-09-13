import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Home, Wrench, Users, LogOut, Settings } from 'lucide-react';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');

  if (!storedUser || storedUser === 'undefined') {
    return {};
  }

  try {
    const parsedUser = JSON.parse(storedUser);
    return parsedUser && typeof parsedUser === 'object' ? parsedUser : {};
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return {};
  }
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user.role) {
    return <Navigate to="/login" replace />;
  }

  const navItems = {
    user: [
      { path: '/resident', icon: Home, label: 'Dashboard' }
    ],
    worker: [
      { path: '/worker', icon: Wrench, label: 'My Tasks' }
    ],
    admin: [
      { path: '/admin', icon: Users, label: 'Admin Portal' }
    ]
  };

  const links = navItems[user.role] || [];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Flat Maintenance Service</h2>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>{user.name}</p>
          <div style={{ marginTop: '4px' }}>
             <span className="badge badge-assigned">{user.role.toUpperCase()}</span>
          </div>
        </div>
        
        <nav className="nav-links" style={{ flex: 1 }}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
