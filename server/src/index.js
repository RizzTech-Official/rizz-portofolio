import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    console.log('✅ Database initialized');

    // Import routes after database is ready
    const { default: authRoutes } = await import('./routes/auth.js');
    const { default: heroRoutes } = await import('./routes/hero.js');
    const { default: aboutRoutes } = await import('./routes/about.js');
    const { default: projectsRoutes } = await import('./routes/projects.js');
    const { default: certificatesRoutes } = await import('./routes/certificates.js');
    const { default: servicesRoutes } = await import('./routes/services.js');
    const { default: contactsRoutes } = await import('./routes/contacts.js');
    const { default: testimonialsRoutes } = await import('./routes/testimonials.js');
    const { default: teamRoutes } = await import('./routes/team.js');
    const { default: clientsRoutes } = await import('./routes/clients.js');
    const { default: faqRoutes } = await import('./routes/faq.js');
    const { default: pricingRoutes } = await import('./routes/pricing.js');
    const { default: blogRoutes } = await import('./routes/blog.js');
    const { default: uploadRoutes } = await import('./routes/upload.js');

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/hero', heroRoutes);
    app.use('/api/about', aboutRoutes);
    app.use('/api/projects', projectsRoutes);
    app.use('/api/certificates', certificatesRoutes);
    app.use('/api/services', servicesRoutes);
    app.use('/api/contacts', contactsRoutes);
    app.use('/api/testimonials', testimonialsRoutes);
    app.use('/api/team', teamRoutes);
    app.use('/api/clients', clientsRoutes);
    app.use('/api/faq', faqRoutes);
    app.use('/api/pricing', pricingRoutes);
    app.use('/api/blog', blogRoutes);
    app.use('/api/upload', uploadRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'RizzTech API Server is running' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Endpoint not found' });
    });

    app.listen(PORT, () => {
      console.log(`🚀 RizzTech API Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
