import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean and parse JSON
const toBool = (val) => val === 1 || val === true;
const parseJSON = (val) => {
  if (!val) return [];
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

const formatPricing = (p) => ({
  ...p,
  is_popular: toBool(p.is_popular),
  is_active: toBool(p.is_active),
  features: parseJSON(p.features),
  not_included: parseJSON(p.not_included)
});

// GET /api/pricing
router.get('/', async (req, res) => {
  try {
    const packages = await dbHelper.prepare('SELECT * FROM pricing_packages WHERE is_active = true ORDER BY "order" ASC, created_at ASC').all();
    res.json(packages.map(formatPricing));
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/pricing/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const pkg = await dbHelper.prepare('SELECT * FROM pricing_packages WHERE id = ?').get(parseInt(req.params.id));

    if (!pkg) {
      return res.status(404).json({ message: 'Pricing package not found' });
    }

    res.json(formatPricing(pkg));
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/pricing
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, price_monthly, price_yearly, features, not_included, is_popular, icon, is_active, order } = req.body;

    const featuresJson = JSON.stringify(features || []);
    const notIncludedJson = JSON.stringify(not_included || []);

    const result = await dbHelper.prepare(`
      INSERT INTO pricing_packages (name, description, price_monthly, price_yearly, features, not_included, is_popular, icon, is_active, "order")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, price_monthly, price_yearly, featuresJson, notIncludedJson, is_popular ? 1 : 0, icon, is_active ? 1 : 0, order || 0);

    const pkg = await dbHelper.prepare('SELECT * FROM pricing_packages WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(formatPricing(pkg));
  } catch (error) {
    console.error('Create pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/pricing/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, price_monthly, price_yearly, features, not_included, is_popular, icon, is_active, order } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM pricing_packages WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Pricing package not found' });
    }

    const featuresJson = JSON.stringify(features || []);
    const notIncludedJson = JSON.stringify(not_included || []);

    await dbHelper.prepare(`
      UPDATE pricing_packages SET 
        name = ?, description = ?, price_monthly = ?, price_yearly = ?, 
        features = ?, not_included = ?, is_popular = ?, icon = ?, is_active = ?, "order" = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, price_monthly, price_yearly, featuresJson, notIncludedJson, is_popular ? 1 : 0, icon, is_active ? 1 : 0, order, parseInt(req.params.id));

    const pkg = await dbHelper.prepare('SELECT * FROM pricing_packages WHERE id = ?').get(parseInt(req.params.id));
    res.json(formatPricing(pkg));
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/pricing/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM pricing_packages WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Pricing package not found' });
    }

    await dbHelper.prepare('DELETE FROM pricing_packages WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Pricing package deleted successfully' });
  } catch (error) {
    console.error('Delete pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
