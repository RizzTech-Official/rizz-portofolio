import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/contacts (protected - admin only)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/contacts/:id (protected)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/contacts (public - contact form submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    res.status(201).json({ message: 'Contact submitted successfully', id: result.insertId });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/contacts/:id/read (protected - mark as read)
router.put('/:id/read', async (req, res) => {
  try {
    await pool.execute('UPDATE contacts SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Contact marked as read' });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/contacts/:id (protected)
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM contacts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
