const express = require('express');
const db = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);

// User and Admin can view requests
router.get('/', async (req, res) => {
  try {
    let query = `
      SELECT sr.*, s.name as service_name, f.flat_number, f.block_name, w.name as worker_name 
      FROM service_requests sr
      LEFT JOIN services s ON sr.service_id = s.id
      LEFT JOIN flats f ON sr.flat_id = f.id
      LEFT JOIN workers w ON sr.worker_id = w.id
    `;
    let params = [];

    if (req.user.role === 'user') {
      query += ' WHERE sr.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY sr.created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Users create requests
router.post('/', verifyRole(['user']), async (req, res) => {
  const { flat_id, service_id, description } = req.body;
  try {
    await db.query(
      'INSERT INTO service_requests (user_id, flat_id, service_id, description) VALUES (?, ?, ?, ?)',
      [req.user.id, flat_id, service_id, description]
    );
    res.json({ message: 'Request created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
