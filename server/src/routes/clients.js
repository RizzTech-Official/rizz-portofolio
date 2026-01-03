import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean
const toBool = (val) => val === 1 || val === true;

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    const clients = await dbHelper.prepare('SELECT * FROM clients WHERE is_active = 1 ORDER BY `order` ASC, created_at ASC').all();
    res.json(clients.map(c => ({ ...c, is_active: toBool(c.is_active) })));
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/clients/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const client = await dbHelper.prepare('SELECT * FROM clients WHERE id = ?').get(parseInt(req.params.id));

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ ...client, is_active: toBool(client.is_active) });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/clients
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, logo_url, website_url, is_active, order } = req.body;

    const result = await dbHelper.prepare(`
      INSERT INTO clients (name, logo_url, website_url, is_active, \`order\`)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, logo_url, website_url, is_active ? 1 : 0, order || 0);

    const client = await dbHelper.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...client, is_active: toBool(client.is_active) });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/clients/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, logo_url, website_url, is_active, order } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM clients WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await dbHelper.prepare(`
      UPDATE clients SET 
        name = ?, logo_url = ?, website_url = ?, is_active = ?, \`order\` = ?,
        updated_at = NOW()
      WHERE id = ?
    `).run(name, logo_url, website_url, is_active ? 1 : 0, order, parseInt(req.params.id));

    const client = await dbHelper.prepare('SELECT * FROM clients WHERE id = ?').get(parseInt(req.params.id));
    res.json({ ...client, is_active: toBool(client.is_active) });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/clients/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM clients WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await dbHelper.prepare('DELETE FROM clients WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
