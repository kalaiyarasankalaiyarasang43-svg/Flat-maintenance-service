const express = require('express');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
