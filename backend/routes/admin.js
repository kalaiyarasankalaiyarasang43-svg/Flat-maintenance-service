const express = require('express');
const db = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(['admin']));

// Get all data overview
router.get('/overview', async (req, res) => {
  try {
    const [[{ users }]] = await db.query('SELECT COUNT(*) as users FROM users');
    const [[{ workers }]] = await db.query('SELECT COUNT(*) as workers FROM workers');
    const [[{ requests }]] = await db.query('SELECT COUNT(*) as requests FROM service_requests');
    const [[{ complaints }]] = await db.query('SELECT COUNT(*) as complaints FROM complaints');
    res.json({ users, workers, requests, complaints });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all requests
router.get('/requests', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sr.*, s.name as service_name, f.flat_number, f.block_name, u.name as resident_name, w.name as worker_name 
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN flats f ON sr.flat_id = f.id
      JOIN users u ON sr.user_id = u.id
      LEFT JOIN workers w ON sr.worker_id = w.id
      ORDER BY sr.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign worker to request
router.put('/requests/:id/assign', async (req, res) => {
  const { worker_id } = req.body;
  const requestId = req.params.id;
  try {
    await db.query(
      'UPDATE service_requests SET worker_id = ?, status = "Assigned" WHERE id = ?',
      [worker_id, requestId]
    );
    res.json({ message: 'Worker assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all workers
router.get('/workers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, specialization, status FROM workers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Resolve complaint
router.put('/complaints/:id/resolve', async (req, res) => {
  try {
    await db.query('UPDATE complaints SET status = "Resolved" WHERE id = ?', [req.params.id]);
    res.json({ message: 'Complaint resolved' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
