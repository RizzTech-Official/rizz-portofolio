import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/hero
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM hero WHERE id = 1');
    res.json(rows[0] || {});
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/hero (protected)
router.put('/', async (req, res) => {
  try {
    const { badge_text, title_line1, title_line2, description, button1_text, button1_link, button2_text, button2_link } = req.body;

    await pool.execute(
      `UPDATE hero SET badge_text = ?, title_line1 = ?, title_line2 = ?, description = ?, 
       button1_text = ?, button1_link = ?, button2_text = ?, button2_link = ? WHERE id = 1`,
      [badge_text, title_line1, title_line2, description, button1_text, button1_link, button2_text, button2_link]
    );

    const [rows] = await pool.execute('SELECT * FROM hero WHERE id = 1');
    res.json(rows[0]);
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
