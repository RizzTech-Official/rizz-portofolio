import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to convert SQLite/MySQL boolean
const toBool = (val) => val === 1 || val === true;

const formatBlog = (b) => ({
  ...b,
  is_published: toBool(b.is_published)
});

// Helper to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// GET /api/blog (public - only published posts)
router.get('/', async (req, res) => {
  try {
    const posts = await dbHelper.prepare('SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC, created_at DESC').all();
    res.json(posts.map(formatBlog));
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/blog/admin (protected - all posts)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const posts = await dbHelper.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
    res.json(posts.map(formatBlog));
  } catch (error) {
    console.error('Get admin blog posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/blog/:id
router.get('/:id', async (req, res) => {
  try {
    // Try to get by ID first, then by slug
    let post = await dbHelper.prepare('SELECT * FROM blog_posts WHERE id = ?').get(parseInt(req.params.id) || 0);
    if (!post) {
      post = await dbHelper.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.id);
    }

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(formatBlog(post));
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/blog
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, slug, excerpt, content, image_url, category, author, read_time, is_published, published_at, order } = req.body;

    const finalSlug = slug || generateSlug(title);
    const finalPublishedAt = is_published ? (published_at || new Date().toISOString()) : null;

    const result = await dbHelper.prepare(`
      INSERT INTO blog_posts (title, slug, excerpt, content, image_url, category, author, read_time, is_published, published_at, "order")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, finalSlug, excerpt, content, image_url, category, author, read_time, is_published ? 1 : 0, finalPublishedAt, order || 0);

    const post = await dbHelper.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(formatBlog(post));
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/blog/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, slug, excerpt, content, image_url, category, author, read_time, is_published, published_at, order } = req.body;

    const existing = await dbHelper.prepare('SELECT * FROM blog_posts WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const finalSlug = slug || generateSlug(title);
    let finalPublishedAt = published_at;

    // If publishing for the first time
    if (is_published && !existing.is_published && !published_at) {
      finalPublishedAt = new Date().toISOString();
    }

    await dbHelper.prepare(`
      UPDATE blog_posts SET 
        title = ?, slug = ?, excerpt = ?, content = ?, image_url = ?, 
        category = ?, author = ?, read_time = ?, is_published = ?, published_at = ?, "order" = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, finalSlug, excerpt, content, image_url, category, author, read_time, is_published ? 1 : 0, finalPublishedAt, order, parseInt(req.params.id));

    const post = await dbHelper.prepare('SELECT * FROM blog_posts WHERE id = ?').get(parseInt(req.params.id));
    res.json(formatBlog(post));
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/blog/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await dbHelper.prepare('SELECT id FROM blog_posts WHERE id = ?').get(parseInt(req.params.id));
    if (!existing) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await dbHelper.prepare('DELETE FROM blog_posts WHERE id = ?').run(parseInt(req.params.id));
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
