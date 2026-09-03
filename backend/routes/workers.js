const express = require('express');
const db = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(['worker']));

// Get requests assigned to this worker OR unassigned matching specialization
router.get('/requests', async (req, res) => {
  try {
    const [workerRows] = await db.query('SELECT specialization FROM workers WHERE id = ?', [req.user.id]);
    const spec = workerRows[0].specialization;

    const [rows] = await db.query(`
      SELECT sr.*, s.name as service_name, f.flat_number, f.block_name, f.address, u.name as resident_name, u.phone as resident_phone
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN flats f ON sr.flat_id = f.id
      JOIN users u ON sr.user_id = u.id
      WHERE sr.worker_id = ? OR (sr.worker_id IS NULL AND sr.status = 'Pending' AND s.name = ?)
      ORDER BY sr.created_at DESC
    `, [req.user.id, spec]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Claim a request
router.put('/requests/:id/claim', async (req, res) => {
  const requestId = req.params.id;
  try {
    await db.query(
      'UPDATE service_requests SET worker_id = ?, status = "Assigned" WHERE id = ? AND worker_id IS NULL',
      [req.user.id, requestId]
    );
    res.json({ message: 'Request claimed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update request status
router.put('/requests/:id', async (req, res) => {
  const { status } = req.body;
  const requestId = req.params.id;
  try {
    await db.query(
      'UPDATE service_requests SET status = ? WHERE id = ? AND worker_id = ?',
      [status, requestId, req.user.id]
    );
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update worker own status
router.put('/status', async (req, res) => {
  const { status } = req.body; // 'Available' or 'Busy'
  try {
    await db.query('UPDATE workers SET status = ? WHERE id = ?', [status, req.user.id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
