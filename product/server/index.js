import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import { runMigrations } from './config/migrate.js';

// Route imports
import authRoutes from './routes/auth.js';
import aboutRoutes from './routes/about.js';
import projectsRoutes from './routes/projects.js';
import certificatesRoutes from './routes/certificates.js';
import servicesRoutes from './routes/services.js';
import contactsRoutes from './routes/contacts.js';
import heroRoutes from './routes/hero.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Public GET routes (no auth required)
app.get('/api/about', async (req, res, next) => {
  const aboutRouter = (await import('./routes/about.js')).default;
  aboutRouter.handle(req, res, next);
});
app.get('/api/services', async (req, res, next) => {
  const servicesRouter = (await import('./routes/services.js')).default;
  servicesRouter.handle(req, res, next);
});
app.get('/api/projects', async (req, res, next) => {
  const projectsRouter = (await import('./routes/projects.js')).default;
  projectsRouter.handle(req, res, next);
});
app.get('/api/projects/:id', async (req, res, next) => {
  const projectsRouter = (await import('./routes/projects.js')).default;
  projectsRouter.handle(req, res, next);
});
app.get('/api/certificates', async (req, res, next) => {
  const certificatesRouter = (await import('./routes/certificates.js')).default;
  certificatesRouter.handle(req, res, next);
});
app.get('/api/hero', async (req, res, next) => {
  const heroRouter = (await import('./routes/hero.js')).default;
  heroRouter.handle(req, res, next);
});

// Public contact form submission
app.post('/api/contacts', async (req, res, next) => {
  const contactsRouter = (await import('./routes/contacts.js')).default;
  contactsRouter.handle(req, res, next);
});

// Protected routes (require auth)
app.use('/api/about', authMiddleware, aboutRoutes);
app.use('/api/projects', authMiddleware, projectsRoutes);
app.use('/api/certificates', authMiddleware, certificatesRoutes);
app.use('/api/services', authMiddleware, servicesRoutes);
app.use('/api/contacts', authMiddleware, contactsRoutes);
app.use('/api/hero', authMiddleware, heroRoutes);

// Auth verify route (protected)
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Run migrations then start server
async function startServer() {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

