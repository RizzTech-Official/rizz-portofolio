import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await dbHelper.prepare('SELECT * FROM services ORDER BY created_at ASC').all();
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/services/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await dbHelper.prepare('SELECT * FROM services WHERE id = ?').get(parseInt(req.params.id));

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/services
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { icon_name, title_en, description_en, title_id, description_id } = req.body;

    const result = await dbHelper.prepare(`
      INSERT INTO services (icon_name, title_en, description_en, title_id, description_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(icon_name, title_en, description_en, title_id, description_id);

    const service = await dbHelper.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/services/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { icon_name, title_en, description_en, title_id, description_id } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM services WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await dbHelper.prepare(`
      UPDATE services SET 
        icon_name = ?, title_en = ?, description_en = ?, title_id = ?, description_id = ?,
        updated_at = NOW()
      WHERE id = ?
    `).run(icon_name, title_en, description_en, title_id, description_id, parseInt(req.params.id));

    const service = await dbHelper.prepare('SELECT * FROM services WHERE id = ?').get(parseInt(req.params.id));
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/services/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM services WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await dbHelper.prepare('DELETE FROM services WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
