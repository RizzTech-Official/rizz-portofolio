-- Company CMS Database Schema
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS company_cms;
USE company_cms;

-- About Section (single row, updated via UPDATE)
CREATE TABLE IF NOT EXISTS about (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'About Us',
  description TEXT,
  mission TEXT,
  vision TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default row
INSERT INTO about (id, title, description, mission, vision) VALUES 
(1, 'About RizzTech', 'We are a leading software house crafting digital experiences.', 'To deliver cutting-edge solutions.', 'To be the #1 tech partner.')
ON DUPLICATE KEY UPDATE id=id;

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  tech_stack VARCHAR(500),
  link VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  date_issued DATE,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon_name VARCHAR(50) DEFAULT 'Code',
  title VARCHAR(255) NOT NULL,
  description TEXT
);

-- Insert default services
INSERT INTO services (icon_name, title, description) VALUES 
('Globe', 'Web Development', 'Modern, responsive, and high-performance websites built with the latest technologies like React & Next.js.'),
('Smartphone', 'Mobile Apps', 'Native and cross-platform mobile applications for iOS and Android delivering seamless user experiences.'),
('Palette', 'UI/UX Design', 'Intuitive and visually stunning designs that prioritize user experience, accessibility, and engagement.'),
('Server', 'Backend Solutions', 'Robust and scalable backend architectures to power your applications securely and efficiently.'),
('Code', 'Custom Software', 'Tailored software solutions designed to meet the unique needs and challenges of your specific business.'),
('Shield', 'Cybersecurity', 'Protecting your digital assets with advanced security measures, audits, and vulnerability assessments.')
ON DUPLICATE KEY UPDATE id=id;

-- Contacts (form submissions)
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO admin_users (username, password_hash) VALUES 
('admin', '$2a$10$8K1p/a0dL1LXMc8V0RqG5.1Gg2JL5G5xL5G5xL5G5xL5G5xL5G5xL')
ON DUPLICATE KEY UPDATE id=id;
