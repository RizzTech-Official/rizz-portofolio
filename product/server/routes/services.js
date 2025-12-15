import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/services (protected)
router.post('/', async (req, res) => {
  try {
    const { icon_name, title, description } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO services (icon_name, title, description) VALUES (?, ?, ?)',
      [icon_name || 'Code', title, description]
    );

    const [rows] = await pool.execute('SELECT * FROM services WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/services/:id (protected)
router.put('/:id', async (req, res) => {
  try {
    const { icon_name, title, description } = req.body;

    await pool.execute(
      'UPDATE services SET icon_name = ?, title = ?, description = ? WHERE id = ?',
      [icon_name, title, description, req.params.id]
    );

    const [rows] = await pool.execute('SELECT * FROM services WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/services/:id (protected)
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
