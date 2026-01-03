import 'dotenv/config';
import { initDatabase, dbHelper, saveDatabase, dbType } from '../config/database.js';
import bcrypt from 'bcryptjs';

async function initDb() {
  console.log('🔧 Initializing database...');
  console.log(`📦 Database type: ${dbType}`);

  await initDatabase();

  const isMySQL = dbHelper.isMySQL();
  const isPostgres = dbHelper.isPostgres();

  // Create tables - syntax varies between SQLite, MySQL, and PostgreSQL
  if (isMySQL) {
    // MySQL tables
    const mysqlTables = [
      `CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS hero (
        id INT AUTO_INCREMENT PRIMARY KEY,
        badge_text_en VARCHAR(255),
        title_line1_en VARCHAR(255),
        title_line2_en VARCHAR(255),
        description_en TEXT,
        button1_text_en VARCHAR(255),
        button2_text_en VARCHAR(255),
        badge_text_id VARCHAR(255),
        title_line1_id VARCHAR(255),
        title_line2_id VARCHAR(255),
        description_id TEXT,
        button1_text_id VARCHAR(255),
        button2_text_id VARCHAR(255),
        button1_link VARCHAR(500),
        button2_link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS about (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_en VARCHAR(255),
        description_en TEXT,
        mission_en TEXT,
        vision_en TEXT,
        title_id VARCHAR(255),
        description_id TEXT,
        mission_id TEXT,
        vision_id TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title_en VARCHAR(255),
        description_en TEXT,
        title_id VARCHAR(255),
        description_id TEXT,
        image_url VARCHAR(500),
        tech_stack VARCHAR(500),
        link VARCHAR(500),
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        issuer VARCHAR(255),
        date_issued DATE,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon_name VARCHAR(100),
        title_en VARCHAR(255),
        description_en TEXT,
        title_id VARCHAR(255),
        description_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255),
        client_photo VARCHAR(500),
        company VARCHAR(255),
        position VARCHAR(255),
        quote TEXT,
        rating INT DEFAULT 5,
        is_active TINYINT(1) DEFAULT 1,
        \`order\` INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        position VARCHAR(255),
        photo VARCHAR(500),
        bio TEXT,
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        email VARCHAR(255),
        is_active TINYINT(1) DEFAULT 1,
        \`order\` INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        logo_url VARCHAR(500),
        website_url VARCHAR(500),
        is_active TINYINT(1) DEFAULT 1,
        \`order\` INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT,
        answer TEXT,
        category VARCHAR(100),
        is_active TINYINT(1) DEFAULT 1,
        \`order\` INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS pricing_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        description TEXT,
        price_monthly DECIMAL(10,2),
        price_yearly DECIMAL(10,2),
        features JSON,
        not_included JSON,
        is_popular TINYINT(1) DEFAULT 0,
        icon VARCHAR(100),
        is_active TINYINT(1) DEFAULT 1,
        \`order\` INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        excerpt TEXT,
        content LONGTEXT,
        image_url VARCHAR(500),
        category VARCHAR(100),
        author VARCHAR(255),
        read_time INT,
        is_published TINYINT(1) DEFAULT 0,
        published_at TIMESTAMP NULL,
        \`order\` INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`
    ];

    for (const sql of mysqlTables) {
      await dbHelper.exec(sql);
    }
  } else if (isPostgres) {
    // PostgreSQL tables
    const pgTables = [
      `CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS hero (
        id SERIAL PRIMARY KEY,
        badge_text_en VARCHAR(255),
        title_line1_en VARCHAR(255),
        title_line2_en VARCHAR(255),
        description_en TEXT,
        button1_text_en VARCHAR(255),
        button2_text_en VARCHAR(255),
        badge_text_id VARCHAR(255),
        title_line1_id VARCHAR(255),
        title_line2_id VARCHAR(255),
        description_id TEXT,
        button1_text_id VARCHAR(255),
        button2_text_id VARCHAR(255),
        button1_link VARCHAR(500),
        button2_link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS about (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255),
        description_en TEXT,
        mission_en TEXT,
        vision_en TEXT,
        title_id VARCHAR(255),
        description_id TEXT,
        mission_id TEXT,
        vision_id TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255),
        description_en TEXT,
        title_id VARCHAR(255),
        description_id TEXT,
        image_url VARCHAR(500),
        tech_stack VARCHAR(500),
        link VARCHAR(500),
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        issuer VARCHAR(255),
        date_issued DATE,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        icon_name VARCHAR(100),
        title_en VARCHAR(255),
        description_en TEXT,
        title_id VARCHAR(255),
        description_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255),
        client_photo VARCHAR(500),
        company VARCHAR(255),
        position VARCHAR(255),
        quote TEXT,
        rating INTEGER DEFAULT 5,
        is_active BOOLEAN DEFAULT TRUE,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        position VARCHAR(255),
        photo VARCHAR(500),
        bio TEXT,
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        email VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        logo_url VARCHAR(500),
        website_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT,
        answer TEXT,
        category VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS pricing_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        description TEXT,
        price_monthly DECIMAL(10,2),
        price_yearly DECIMAL(10,2),
        features JSONB,
        not_included JSONB,
        is_popular BOOLEAN DEFAULT FALSE,
        icon VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        excerpt TEXT,
        content TEXT,
        image_url VARCHAR(500),
        category VARCHAR(100),
        author VARCHAR(255),
        read_time INTEGER,
        is_published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const sql of pgTables) {
      await dbHelper.exec(sql);
    }
  } else {
    // SQLite tables
    const sqliteTables = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS hero (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge_text_en TEXT, title_line1_en TEXT, title_line2_en TEXT, description_en TEXT,
        button1_text_en TEXT, button2_text_en TEXT,
        badge_text_id TEXT, title_line1_id TEXT, title_line2_id TEXT, description_id TEXT,
        button1_text_id TEXT, button2_text_id TEXT,
        button1_link TEXT, button2_link TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS about (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_en TEXT, description_en TEXT, mission_en TEXT, vision_en TEXT,
        title_id TEXT, description_id TEXT, mission_id TEXT, vision_id TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_en TEXT, description_en TEXT, title_id TEXT, description_id TEXT,
        image_url TEXT, tech_stack TEXT, link TEXT, is_featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, issuer TEXT, date_issued DATE, image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon_name TEXT, title_en TEXT, description_en TEXT, title_id TEXT, description_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT, message TEXT, is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT, client_photo TEXT, company TEXT, position TEXT, quote TEXT,
        rating INTEGER DEFAULT 5, is_active INTEGER DEFAULT 1, "order" INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, position TEXT, photo TEXT, bio TEXT, linkedin_url TEXT, github_url TEXT, email TEXT,
        is_active INTEGER DEFAULT 1, "order" INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, logo_url TEXT, website_url TEXT, is_active INTEGER DEFAULT 1, "order" INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT, answer TEXT, category TEXT, is_active INTEGER DEFAULT 1, "order" INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS pricing_packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, description TEXT, price_monthly REAL, price_yearly REAL,
        features TEXT, not_included TEXT, is_popular INTEGER DEFAULT 0, icon TEXT,
        is_active INTEGER DEFAULT 1, "order" INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, slug TEXT UNIQUE, excerpt TEXT, content TEXT, image_url TEXT,
        category TEXT, author TEXT, read_time INTEGER, is_published INTEGER DEFAULT 0,
        published_at DATETIME, "order" INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const statements = sqliteTables.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        dbHelper.exec(stmt);
      }
    }
  }

  // Check if admin exists, if not create default admin
  const adminExists = await dbHelper.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (adminExists.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    await dbHelper.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('✅ Default admin user created (username: admin, password: admin123)');
  }

  if (!isMySQL && !isPostgres) {
    saveDatabase();
  }
  console.log('✅ Database initialized successfully!');
}

initDb().catch(console.error);
