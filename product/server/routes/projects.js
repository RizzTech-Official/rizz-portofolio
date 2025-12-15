import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects (protected)
router.post('/', async (req, res) => {
  try {
    const { title, description, image_url, tech_stack, link, is_featured } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO projects (title, description, image_url, tech_stack, link, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image_url, tech_stack, link, is_featured || false]
    );

    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/projects/:id (protected)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, image_url, tech_stack, link, is_featured } = req.body;

    await pool.execute(
      'UPDATE projects SET title = ?, description = ?, image_url = ?, tech_stack = ?, link = ?, is_featured = ? WHERE id = ?',
      [title, description, image_url, tech_stack, link, is_featured || false, req.params.id]
    );

    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/projects/:id (protected)
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
