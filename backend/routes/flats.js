const express = require('express');
const db = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(['user', 'admin']));

router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM flats';
    let params = [];
    if (req.user.role === 'user') {
      query += ' WHERE user_id = ?';
      params.push(req.user.id);
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ error: 'Only users can add flats' });
  const { flat_number, floor_number, block_name, address } = req.body;
  try {
    await db.query(
      'INSERT INTO flats (user_id, flat_number, floor_number, block_name, address) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, flat_number, floor_number, block_name, address]
    );
    res.json({ message: 'Flat added' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
