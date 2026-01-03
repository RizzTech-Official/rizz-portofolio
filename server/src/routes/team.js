import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean
const toBool = (val) => val === 1 || val === true;

// GET /api/team
router.get('/', async (req, res) => {
  try {
    const members = await dbHelper.prepare('SELECT * FROM team_members WHERE is_active = true ORDER BY "order" ASC, created_at ASC').all();
    res.json(members.map(m => ({ ...m, is_active: toBool(m.is_active) })));
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/team/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const member = await dbHelper.prepare('SELECT * FROM team_members WHERE id = ?').get(parseInt(req.params.id));

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ ...member, is_active: toBool(member.is_active) });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/team
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, position, photo, bio, linkedin_url, github_url, email, is_active, order } = req.body;

    const result = await dbHelper.prepare(`
      INSERT INTO team_members (name, position, photo, bio, linkedin_url, github_url, email, is_active, "order")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, position, photo, bio, linkedin_url, github_url, email, is_active ? 1 : 0, order || 0);

    const member = await dbHelper.prepare('SELECT * FROM team_members WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...member, is_active: toBool(member.is_active) });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/team/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, position, photo, bio, linkedin_url, github_url, email, is_active, order } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM team_members WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await dbHelper.prepare(`
      UPDATE team_members SET 
        name = ?, position = ?, photo = ?, bio = ?, linkedin_url = ?, 
        github_url = ?, email = ?, is_active = ?, "order" = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, position, photo, bio, linkedin_url, github_url, email, is_active ? 1 : 0, order, parseInt(req.params.id));

    const member = await dbHelper.prepare('SELECT * FROM team_members WHERE id = ?').get(parseInt(req.params.id));
    res.json({ ...member, is_active: toBool(member.is_active) });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/team/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM team_members WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await dbHelper.prepare('DELETE FROM team_members WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
