import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/hero
router.get('/', async (req, res) => {
  try {
    let hero = await dbHelper.prepare('SELECT * FROM hero LIMIT 1').get();

    if (!hero) {
      hero = {
        id: null,
        badge_text_en: '',
        title_line1_en: '',
        title_line2_en: '',
        description_en: '',
        button1_text_en: '',
        button2_text_en: '',
        badge_text_id: '',
        title_line1_id: '',
        title_line2_id: '',
        description_id: '',
        button1_text_id: '',
        button2_text_id: '',
        button1_link: '',
        button2_link: ''
      };
    }

    res.json(hero);
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/hero
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      badge_text_en, title_line1_en, title_line2_en, description_en, button1_text_en, button2_text_en,
      badge_text_id, title_line1_id, title_line2_id, description_id, button1_text_id, button2_text_id,
      button1_link, button2_link
    } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM hero LIMIT 1').get();

    if (existing) {
      await dbHelper.prepare(`
        UPDATE hero SET 
          badge_text_en = ?, title_line1_en = ?, title_line2_en = ?, description_en = ?, 
          button1_text_en = ?, button2_text_en = ?,
          badge_text_id = ?, title_line1_id = ?, title_line2_id = ?, description_id = ?,
          button1_text_id = ?, button2_text_id = ?,
          button1_link = ?, button2_link = ?,
          updated_at = NOW()
        WHERE id = ?
      `).run(
        badge_text_en, title_line1_en, title_line2_en, description_en, button1_text_en, button2_text_en,
        badge_text_id, title_line1_id, title_line2_id, description_id, button1_text_id, button2_text_id,
        button1_link, button2_link, existing.id
      );
    } else {
      await dbHelper.prepare(`
        INSERT INTO hero (
          badge_text_en, title_line1_en, title_line2_en, description_en, button1_text_en, button2_text_en,
          badge_text_id, title_line1_id, title_line2_id, description_id, button1_text_id, button2_text_id,
          button1_link, button2_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        badge_text_en, title_line1_en, title_line2_en, description_en, button1_text_en, button2_text_en,
        badge_text_id, title_line1_id, title_line2_id, description_id, button1_text_id, button2_text_id,
        button1_link, button2_link
      );
    }

    const hero = await dbHelper.prepare('SELECT * FROM hero LIMIT 1').get();
    res.json(hero);
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
