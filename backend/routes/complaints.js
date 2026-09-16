const express = require('express');
const db = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    let query = `SELECT c.*, u.name as resident_name, u.email as resident_email,
      w.name as worker_name, w.phone as worker_phone
      FROM complaints c JOIN users u ON c.user_id = u.id
      LEFT JOIN workers w ON c.worker_id = w.id`;
    let params = [];
    if (req.user.role === 'user') {
      query += ' WHERE c.user_id = ?';
      params.push(req.user.id);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', verifyRole(['user']), async (req, res) => {
  const { subject, complaint_date, message, worker_id } = req.body;
  if (!subject || !message || !/^\d{4}-\d{2}-\d{2}$/.test(complaint_date)) return res.status(400).json({ error: 'Subject, complaint date, and message are required' });
  try {
    if (worker_id) {
      const [workers] = await db.query('SELECT id FROM workers WHERE id = ?', [worker_id]);
      if (workers.length === 0) return res.status(400).json({ error: 'Selected worker was not found' });
    }
    await db.query(
      'INSERT INTO complaints (user_id, worker_id, subject, complaint_date, message) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, worker_id || null, subject, complaint_date, message]
    );
    res.json({ message: 'Complaint lodged' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
