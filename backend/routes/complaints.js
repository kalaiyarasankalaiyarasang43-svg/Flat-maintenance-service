const express = require('express');
const db = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM complaints';
    let params = [];
    if (req.user.role === 'user') {
      query += ' WHERE user_id = ?';
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
  const { subject, message } = req.body;
  try {
    await db.query(
      'INSERT INTO complaints (user_id, subject, message) VALUES (?, ?, ?)',
      [req.user.id, subject, message]
    );
    res.json({ message: 'Complaint lodged' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
