import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/about
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM about WHERE id = 1');
    res.json(rows[0] || {});
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/about (protected)
router.put('/', async (req, res) => {
  try {
    const { title, description, mission, vision } = req.body;

    await pool.execute(
      'UPDATE about SET title = ?, description = ?, mission = ?, vision = ? WHERE id = 1',
      [title, description, mission, vision]
    );

    const [rows] = await pool.execute('SELECT * FROM about WHERE id = 1');
    res.json(rows[0]);
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
