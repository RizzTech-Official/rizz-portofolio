# Laravel API Setup

## Prerequisites
- PHP 8.2+
- MySQL
- Composer

## Configuration

1. **Configure database in `.env`:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=company_cms
DB_USERNAME=root
DB_PASSWORD=your_password
```

2. **Run migrations and seed:**
```bash
php artisan migrate
php artisan db:seed
```

3. **Start the server:**
```bash
php artisan serve --port=5000
```

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login |
| GET | /api/hero | No | Get hero |
| PUT | /api/hero | Yes | Update hero |
| GET | /api/about | No | Get about |
| PUT | /api/about | Yes | Update about |
| GET | /api/projects | No | List projects |
| POST | /api/projects | Yes | Create project |
| PUT | /api/projects/{id} | Yes | Update project |
| DELETE | /api/projects/{id} | Yes | Delete project |
| GET | /api/certificates | No | List certificates |
| POST | /api/certificates | Yes | Create certificate |
| GET | /api/services | No | List services |
| POST | /api/services | Yes | Create service |
| POST | /api/contacts | No | Submit contact |
| GET | /api/contacts | Yes | List contacts |
