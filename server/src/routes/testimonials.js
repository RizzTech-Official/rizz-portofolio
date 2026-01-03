import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean
const toBool = (val) => val === 1 || val === true;

// GET /api/testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await dbHelper.prepare('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY `order` ASC, created_at DESC').all();
    res.json(testimonials.map(t => ({ ...t, is_active: toBool(t.is_active) })));
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/testimonials/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const testimonial = await dbHelper.prepare('SELECT * FROM testimonials WHERE id = ?').get(parseInt(req.params.id));

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ ...testimonial, is_active: toBool(testimonial.is_active) });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/testimonials
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { client_name, client_photo, company, position, quote, rating, is_active, order } = req.body;

    const result = await dbHelper.prepare(`
      INSERT INTO testimonials (client_name, client_photo, company, position, quote, rating, is_active, \`order\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(client_name, client_photo, company, position, quote, rating || 5, is_active ? 1 : 0, order || 0);

    const testimonial = await dbHelper.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...testimonial, is_active: toBool(testimonial.is_active) });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/testimonials/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { client_name, client_photo, company, position, quote, rating, is_active, order } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM testimonials WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await dbHelper.prepare(`
      UPDATE testimonials SET 
        client_name = ?, client_photo = ?, company = ?, position = ?, quote = ?, 
        rating = ?, is_active = ?, \`order\` = ?,
        updated_at = NOW()
      WHERE id = ?
    `).run(client_name, client_photo, company, position, quote, rating, is_active ? 1 : 0, order, parseInt(req.params.id));

    const testimonial = await dbHelper.prepare('SELECT * FROM testimonials WHERE id = ?').get(parseInt(req.params.id));
    res.json({ ...testimonial, is_active: toBool(testimonial.is_active) });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/testimonials/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM testimonials WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await dbHelper.prepare('DELETE FROM testimonials WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
