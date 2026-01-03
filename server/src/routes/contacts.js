import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean
const toBool = (val) => val === 1 || val === true;

// POST /api/contacts (public - contact form submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const result = await dbHelper.prepare(`
      INSERT INTO contacts (name, email, subject, message, is_read)
      VALUES (?, ?, ?, ?, 0)
    `).run(name, email, subject, message);

    res.status(201).json({
      message: 'Contact form submitted successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/contacts (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const contacts = await dbHelper.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json(contacts.map(c => ({ ...c, is_read: toBool(c.is_read) })));
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/contacts/:id (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await dbHelper.prepare('SELECT * FROM contacts WHERE id = ?').get(parseInt(req.params.id));

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ ...contact, is_read: toBool(contact.is_read) });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/contacts/:id/read (protected)
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM contacts WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await dbHelper.prepare(`
      UPDATE contacts SET is_read = 1, updated_at = NOW() WHERE id = ?
    `).run(parseInt(req.params.id));

    const contact = await dbHelper.prepare('SELECT * FROM contacts WHERE id = ?').get(parseInt(req.params.id));
    res.json({ ...contact, is_read: toBool(contact.is_read) });
  } catch (error) {
    console.error('Mark contact read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/contacts/:id (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM contacts WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await dbHelper.prepare('DELETE FROM contacts WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
