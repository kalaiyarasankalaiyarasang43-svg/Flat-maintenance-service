import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import ResidentDashboard from './views/ResidentDashboard';
import WorkerDashboard from './views/WorkerDashboard';
import AdminDashboard from './views/AdminDashboard';
import Home from './views/Home';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route path="resident" element={<ResidentDashboard />} />
          <Route path="worker" element={<WorkerDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
