import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await dbHelper.prepare('SELECT * FROM certificates ORDER BY date_issued DESC').all();
    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/certificates/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const certificate = await dbHelper.prepare('SELECT * FROM certificates WHERE id = ?').get(parseInt(req.params.id));

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/certificates
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, issuer, date_issued, image_url } = req.body;

    const result = await dbHelper.prepare(`
      INSERT INTO certificates (title, issuer, date_issued, image_url)
      VALUES (?, ?, ?, ?)
    `).run(title, issuer, date_issued, image_url);

    const certificate = await dbHelper.prepare('SELECT * FROM certificates WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(certificate);
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/certificates/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, issuer, date_issued, image_url } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM certificates WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    await dbHelper.prepare(`
      UPDATE certificates SET 
        title = ?, issuer = ?, date_issued = ?, image_url = ?,
        updated_at = NOW()
      WHERE id = ?
    `).run(title, issuer, date_issued, image_url, parseInt(req.params.id));

    const certificate = await dbHelper.prepare('SELECT * FROM certificates WHERE id = ?').get(parseInt(req.params.id));
    res.json(certificate);
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/certificates/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM certificates WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    await dbHelper.prepare('DELETE FROM certificates WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
