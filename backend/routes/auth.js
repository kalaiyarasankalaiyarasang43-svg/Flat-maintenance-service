const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });

  try {
    let table = 'users';
    if (role === 'worker') table = 'workers';
    if (role === 'admin') table = 'admins';

    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, phone, password, role, specialization } = req.body;
  if (!name || !email || !phone || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  
  if (role === 'worker' && !specialization) return res.status(400).json({ error: 'Missing specialization for worker' });
  if (role !== 'user' && role !== 'worker') return res.status(400).json({ error: 'Invalid role' });

  try {
    const table = role === 'worker' ? 'workers' : 'users';
    const [existing] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    
    if (role === 'worker') {
      await db.query('INSERT INTO workers (name, email, phone, password, specialization) VALUES (?, ?, ?, ?, ?)', [name, email, phone, hashed, specialization]);
    } else {
      await db.query('INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)', [name, email, phone, hashed]);
    }
    
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
