import 'dotenv/config';
import { initDatabase, dbHelper, saveDatabase } from '../config/database.js';

async function seedDb() {
  console.log('🌱 Seeding database...');
  console.log(`📦 Database type: ${process.env.DB_TYPE || 'sqlite'}`);

  await initDatabase();
  const isMySQL = dbHelper.isMySQL();

  // Seed Hero
  const heroExists = await dbHelper.prepare('SELECT COUNT(*) as count FROM hero').get();
  if (heroExists.count === 0) {
    await dbHelper.prepare(`
      INSERT INTO hero (
        badge_text_en, title_line1_en, title_line2_en, description_en, button1_text_en, button2_text_en,
        badge_text_id, title_line1_id, title_line2_id, description_id, button1_text_id, button2_text_id,
        button1_link, button2_link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Welcome to RizzTech', 'Building Digital', 'Excellence',
      'We transform your ideas into powerful digital solutions. Expert web development, mobile apps, and IT consulting services.',
      'Get Started', 'Learn More',
      'Selamat Datang di RizzTech', 'Membangun Keunggulan', 'Digital',
      'Kami mengubah ide Anda menjadi solusi digital yang powerful. Layanan pengembangan web, aplikasi mobile, dan konsultasi IT.',
      'Mulai Sekarang', 'Pelajari Lebih',
      '#contact', '#about'
    );
    console.log('✅ Hero seeded');
  }

  // Seed About
  const aboutExists = await dbHelper.prepare('SELECT COUNT(*) as count FROM about').get();
  if (aboutExists.count === 0) {
    await dbHelper.prepare(`
      INSERT INTO about (
        title_en, description_en, mission_en, vision_en,
        title_id, description_id, mission_id, vision_id,
        image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'About RizzTech',
      'We are a passionate team of developers and designers dedicated to creating exceptional digital experiences.',
      'To deliver innovative and high-quality software solutions that empower businesses to achieve their goals.',
      'To be the leading technology partner for businesses worldwide, known for excellence and innovation.',
      'Tentang RizzTech',
      'Kami adalah tim developer dan designer yang bersemangat untuk menciptakan pengalaman digital yang luar biasa.',
      'Memberikan solusi perangkat lunak inovatif dan berkualitas tinggi yang memberdayakan bisnis mencapai tujuan mereka.',
      'Menjadi mitra teknologi terkemuka untuk bisnis di seluruh dunia, dikenal karena keunggulan dan inovasi.',
      null
    );
    console.log('✅ About seeded');
  }

  // Seed sample Services
  const servicesExists = await dbHelper.prepare('SELECT COUNT(*) as count FROM services').get();
  if (servicesExists.count === 0) {
    const services = [
      ['Code', 'Web Development', 'Custom websites and web applications built with modern technologies.', 'Pengembangan Web', 'Website dan aplikasi web kustom dengan teknologi modern.'],
      ['Smartphone', 'Mobile Apps', 'Native and cross-platform mobile applications for iOS and Android.', 'Aplikasi Mobile', 'Aplikasi mobile native dan cross-platform untuk iOS dan Android.'],
      ['Settings', 'IT Consulting', 'Strategic technology consulting to help your business grow.', 'Konsultasi IT', 'Konsultasi teknologi strategis untuk membantu bisnis Anda berkembang.'],
    ];

    for (const service of services) {
      await dbHelper.prepare('INSERT INTO services (icon_name, title_en, description_en, title_id, description_id) VALUES (?, ?, ?, ?, ?)').run(...service);
    }
    console.log('✅ Services seeded');
  }

  // Seed sample Projects
  const projectsExists = await dbHelper.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projectsExists.count === 0) {
    const projects = [
      ['E-Commerce Platform', 'A full-featured e-commerce platform with payment integration.', 'Platform E-Commerce', 'Platform e-commerce lengkap dengan integrasi pembayaran.', 'React, Node.js, MongoDB', 'https://example.com', 1],
      ['Company Profile', 'Modern company profile website with CMS.', 'Profil Perusahaan', 'Website profil perusahaan modern dengan CMS.', 'Vue.js, Laravel', 'https://example.com', 1],
    ];

    for (const project of projects) {
      await dbHelper.prepare('INSERT INTO projects (title_en, description_en, title_id, description_id, tech_stack, link, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)').run(...project);
    }
    console.log('✅ Projects seeded');
  }

  if (!isMySQL) {
    saveDatabase();
  }
  console.log('✅ Database seeding completed!');
}

seedDb().catch(console.error);
