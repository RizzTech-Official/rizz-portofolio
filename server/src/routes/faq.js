import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean
const toBool = (val) => val === 1 || val === true;

// GET /api/faq
router.get('/', async (req, res) => {
  try {
    const faqs = await dbHelper.prepare('SELECT * FROM faqs WHERE is_active = true ORDER BY "order" ASC, created_at ASC').all();
    res.json(faqs.map(f => ({ ...f, is_active: toBool(f.is_active) })));
  } catch (error) {
    console.error('Get faqs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/faq/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const faq = await dbHelper.prepare('SELECT * FROM faqs WHERE id = ?').get(parseInt(req.params.id));

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ ...faq, is_active: toBool(faq.is_active) });
  } catch (error) {
    console.error('Get faq error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/faq
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { question, answer, category, is_active, order } = req.body;

    const result = await dbHelper.prepare(`
      INSERT INTO faqs (question, answer, category, is_active, "order")
      VALUES (?, ?, ?, ?, ?)
    `).run(question, answer, category, is_active ? 1 : 0, order || 0);

    const faq = await dbHelper.prepare('SELECT * FROM faqs WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...faq, is_active: toBool(faq.is_active) });
  } catch (error) {
    console.error('Create faq error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/faq/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { question, answer, category, is_active, order } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM faqs WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await dbHelper.prepare(`
      UPDATE faqs SET 
        question = ?, answer = ?, category = ?, is_active = ?, "order" = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(question, answer, category, is_active ? 1 : 0, order, parseInt(req.params.id));

    const faq = await dbHelper.prepare('SELECT * FROM faqs WHERE id = ?').get(parseInt(req.params.id));
    res.json({ ...faq, is_active: toBool(faq.is_active) });
  } catch (error) {
    console.error('Update faq error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/faq/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM faqs WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await dbHelper.prepare('DELETE FROM faqs WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete faq error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
