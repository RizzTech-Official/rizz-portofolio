import express from 'express';
import { dbHelper, dbType } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean
const toBool = (val) => val === 1 || val === true;

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await dbHelper.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    res.json(projects.map(p => ({ ...p, is_featured: toBool(p.is_featured) })));
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await dbHelper.prepare('SELECT * FROM projects WHERE id = ?').get(parseInt(req.params.id));

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ ...project, is_featured: toBool(project.is_featured) });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/projects
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Support both old (title_en) and new (title) field names
    const {
      title, title_en, description, description_en,
      title_id, description_id, image_url, tech_stack,
      link, live_url, is_featured
    } = req.body;

    const finalTitle = title || title_en || '';
    const finalDesc = description || description_en || '';
    const finalLink = live_url || link || '';

    const result = await dbHelper.prepare(`
      INSERT INTO projects (title_en, description_en, title_id, description_id, image_url, tech_stack, link, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(finalTitle, finalDesc, title_id || '', description_id || '', image_url || '', tech_stack || '', finalLink, is_featured ? 1 : 0);

    const project = await dbHelper.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...project, is_featured: toBool(project.is_featured) });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Support both old (title_en) and new (title) field names
    const {
      title, title_en, description, description_en,
      title_id, description_id, image_url, tech_stack,
      link, live_url, is_featured
    } = req.body;

    const finalTitle = title || title_en || '';
    const finalDesc = description || description_en || '';
    const finalLink = live_url || link || '';

    const existing = await dbHelper.prepare('SELECT id FROM projects WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Use proper timestamp function based on DB type
    const nowFunc = dbType === 'mysql' ? 'NOW()' : "datetime('now')";

    await dbHelper.prepare(`
      UPDATE projects SET 
        title_en = ?, description_en = ?, title_id = ?, description_id = ?,
        image_url = ?, tech_stack = ?, link = ?, is_featured = ?,
        updated_at = ${nowFunc}
      WHERE id = ?
    `).run(finalTitle, finalDesc, title_id || '', description_id || '', image_url || '', tech_stack || '', finalLink, is_featured ? 1 : 0, parseInt(req.params.id));

    const project = await dbHelper.prepare('SELECT * FROM projects WHERE id = ?').get(parseInt(req.params.id));
    res.json({ ...project, is_featured: toBool(project.is_featured) });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM projects WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await dbHelper.prepare('DELETE FROM projects WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
