import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/certificates
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM certificates ORDER BY date_issued DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/certificates/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/certificates (protected)
router.post('/', async (req, res) => {
  try {
    const { title, issuer, date_issued, image_url } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO certificates (title, issuer, date_issued, image_url) VALUES (?, ?, ?, ?)',
      [title, issuer, date_issued, image_url]
    );

    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/certificates/:id (protected)
router.put('/:id', async (req, res) => {
  try {
    const { title, issuer, date_issued, image_url } = req.body;

    await pool.execute(
      'UPDATE certificates SET title = ?, issuer = ?, date_issued = ?, image_url = ? WHERE id = ?',
      [title, issuer, date_issued, image_url, req.params.id]
    );

    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/certificates/:id (protected)
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
