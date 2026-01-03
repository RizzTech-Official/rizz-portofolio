import express from 'express';
import { dbHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/about
router.get('/', async (req, res) => {
  try {
    let about = await dbHelper.prepare('SELECT * FROM about LIMIT 1').get();

    if (!about) {
      about = {
        id: null,
        title_en: '',
        description_en: '',
        mission_en: '',
        vision_en: '',
        title_id: '',
        description_id: '',
        mission_id: '',
        vision_id: '',
        image_url: null
      };
    }

    res.json(about);
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/about
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      title_en, description_en, mission_en, vision_en,
      title_id, description_id, mission_id, vision_id,
      image_url
    } = req.body;

    const existing = await dbHelper.prepare('SELECT id FROM about LIMIT 1').get();

    if (existing) {
      await dbHelper.prepare(`
        UPDATE about SET 
          title_en = ?, description_en = ?, mission_en = ?, vision_en = ?,
          title_id = ?, description_id = ?, mission_id = ?, vision_id = ?,
          image_url = ?,
          updated_at = NOW()
        WHERE id = ?
      `).run(
        title_en, description_en, mission_en, vision_en,
        title_id, description_id, mission_id, vision_id,
        image_url, existing.id
      );
    } else {
      await dbHelper.prepare(`
        INSERT INTO about (
          title_en, description_en, mission_en, vision_en,
          title_id, description_id, mission_id, vision_id,
          image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        title_en, description_en, mission_en, vision_en,
        title_id, description_id, mission_id, vision_id,
        image_url
      );
    }

    const about = await dbHelper.prepare('SELECT * FROM about LIMIT 1').get();
    res.json(about);
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
