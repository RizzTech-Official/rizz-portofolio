import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
};

const DB_NAME = process.env.DB_NAME || 'company_cms';

export async function runMigrations() {
  let connection;

  try {
    // Connect without database first
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('🔄 Running database migrations...');

    // Create database if not exists (use query instead of execute)
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready`);

    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS about (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) DEFAULT 'About Us',
        description TEXT,
        mission TEXT,
        vision TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        tech_stack VARCHAR(500),
        link VARCHAR(500),
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255),
        date_issued DATE,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon_name VARCHAR(50) DEFAULT 'Code',
        title VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS hero (
        id INT AUTO_INCREMENT PRIMARY KEY,
        badge_text VARCHAR(255) DEFAULT '🚀 Shaping the Digital Future',
        title_line1 VARCHAR(255) DEFAULT 'Innovating',
        title_line2 VARCHAR(255) DEFAULT 'The Future',
        description TEXT,
        button1_text VARCHAR(100) DEFAULT 'Get Started',
        button1_link VARCHAR(255) DEFAULT '#contact',
        button2_text VARCHAR(100) DEFAULT 'Learn More',
        button2_link VARCHAR(255) DEFAULT '#about',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created');

    // Seed default data
    await seedDefaultData(connection);

    console.log('✅ Migrations completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

async function seedDefaultData(connection) {
  // Check if about exists
  const [aboutRows] = await connection.execute('SELECT COUNT(*) as count FROM about');
  if (aboutRows[0].count === 0) {
    await connection.execute(`
      INSERT INTO about (id, title, description, mission, vision) VALUES 
      (1, 'About RizzTech', 'We are a leading software house crafting digital experiences.', 'To deliver cutting-edge solutions.', 'To be the #1 tech partner.')
    `);
    console.log('  📝 Seeded about data');
  }

  // Check if services exist
  const [serviceRows] = await connection.execute('SELECT COUNT(*) as count FROM services');
  if (serviceRows[0].count === 0) {
    await connection.execute(`
      INSERT INTO services (icon_name, title, description) VALUES 
      ('Globe', 'Web Development', 'Modern, responsive, and high-performance websites built with the latest technologies.'),
      ('Smartphone', 'Mobile Apps', 'Native and cross-platform mobile applications for iOS and Android.'),
      ('Palette', 'UI/UX Design', 'Intuitive and visually stunning designs that prioritize user experience.'),
      ('Server', 'Backend Solutions', 'Robust and scalable backend architectures to power your applications.'),
      ('Code', 'Custom Software', 'Tailored software solutions designed for your specific business needs.'),
      ('Shield', 'Cybersecurity', 'Protecting your digital assets with advanced security measures.')
    `);
    console.log('  📝 Seeded services data');
  }

  // Check if admin user exists
  const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM admin_users');
  if (adminRows[0].count === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    await connection.execute(
      'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
      ['admin', passwordHash]
    );
    console.log('  📝 Created default admin user (admin / admin123)');
  }

  // Check if hero exists
  const [heroRows] = await connection.execute('SELECT COUNT(*) as count FROM hero');
  if (heroRows[0].count === 0) {
    await connection.execute(`
      INSERT INTO hero (id, badge_text, title_line1, title_line2, description, button1_text, button1_link, button2_text, button2_link) VALUES 
      (1, '🚀 Shaping the Digital Future', 'Innovating', 'The Future', 'We are RizzTech. A leading software house crafting digital experiences with cutting-edge technology and premium design.', 'Get Started', '#contact', 'Learn More', '#about')
    `);
    console.log('  📝 Seeded hero data');
  }
}
