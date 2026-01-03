import mysql from 'mysql2/promise';
import initSqlJs from 'sql.js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dbType = process.env.DB_TYPE || 'sqlite';

// MySQL Pool
let mysqlPool = null;

// PostgreSQL Pool
let pgPool = null;

// SQLite Database
let sqliteDb = null;
let SQL = null;
const sqliteDbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

// Initialize database based on type
export async function initDatabase() {
  if (dbType === 'mysql') {
    return initMySQL();
  } else if (dbType === 'postgres' || dbType === 'postgresql') {
    return initPostgres();
  } else {
    return initSQLite();
  }
}

// Initialize MySQL
async function initMySQL() {
  if (mysqlPool) return mysqlPool;

  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rizz_portfolio',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    await mysqlPool.getConnection();
    console.log('✅ MySQL connected');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    throw err;
  }

  return mysqlPool;
}

// Initialize PostgreSQL
async function initPostgres() {
  if (pgPool) return pgPool;

  // Support connection string (for Supabase/Render)
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    pgPool = new pg.Pool({
      connectionString,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
  } else {
    pgPool = new pg.Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'rizz_portfolio',
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
  }

  try {
    await pgPool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    throw err;
  }

  return pgPool;
}

// Initialize SQLite
async function initSQLite() {
  if (sqliteDb) return sqliteDb;

  SQL = await initSqlJs();

  if (fs.existsSync(sqliteDbPath)) {
    const buffer = fs.readFileSync(sqliteDbPath);
    sqliteDb = new SQL.Database(buffer);
  } else {
    sqliteDb = new SQL.Database();
  }

  return sqliteDb;
}

// Save SQLite database to file
export function saveDatabase() {
  if (dbType === 'sqlite' && sqliteDb) {
    const data = sqliteDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(sqliteDbPath, buffer);
  }
}

// Database helper object with unified API
export const dbHelper = {
  prepare: (sql) => {
    if (dbType === 'mysql') {
      return {
        run: async (...params) => {
          const [result] = await mysqlPool.execute(sql, params);
          return { lastInsertRowid: result.insertId };
        },
        get: async (...params) => {
          const [rows] = await mysqlPool.execute(sql, params);
          return rows[0] || null;
        },
        all: async (...params) => {
          const [rows] = await mysqlPool.execute(sql, params);
          return rows;
        }
      };
    } else if (dbType === 'postgres' || dbType === 'postgresql') {
      // PostgreSQL uses $1, $2 placeholders instead of ?
      const pgSql = sql.replace(/\?/g, (_, i) => `$${sql.substring(0, sql.indexOf(_)).split('?').length}`);
      let paramIndex = 0;
      const pgSqlFixed = sql.replace(/\?/g, () => `$${++paramIndex}`);

      return {
        run: async (...params) => {
          const result = await pgPool.query(pgSqlFixed + ' RETURNING id', params);
          return { lastInsertRowid: result.rows[0]?.id };
        },
        get: async (...params) => {
          const result = await pgPool.query(pgSqlFixed, params);
          return result.rows[0] || null;
        },
        all: async (...params) => {
          const result = await pgPool.query(pgSqlFixed, params);
          return result.rows;
        }
      };
    } else {
      // SQLite (synchronous)
      return {
        run: (...params) => {
          const stmt = sqliteDb.prepare(sql);
          stmt.bind(params);
          stmt.step();
          stmt.free();
          saveDatabase();
          return { lastInsertRowid: sqliteDb.exec("SELECT last_insert_rowid()")[0]?.values[0][0] };
        },
        get: (...params) => {
          const stmt = sqliteDb.prepare(sql);
          stmt.bind(params);
          let result = null;
          if (stmt.step()) {
            const columns = stmt.getColumnNames();
            const values = stmt.get();
            result = {};
            columns.forEach((col, i) => {
              result[col] = values[i];
            });
          }
          stmt.free();
          return result;
        },
        all: (...params) => {
          const stmt = sqliteDb.prepare(sql);
          stmt.bind(params);
          const results = [];
          while (stmt.step()) {
            const columns = stmt.getColumnNames();
            const values = stmt.get();
            const row = {};
            columns.forEach((col, i) => {
              row[col] = values[i];
            });
            results.push(row);
          }
          stmt.free();
          return results;
        }
      };
    }
  },
  exec: async (sql) => {
    if (dbType === 'mysql') {
      await mysqlPool.query(sql);
    } else if (dbType === 'postgres' || dbType === 'postgresql') {
      await pgPool.query(sql);
    } else {
      sqliteDb.run(sql);
      saveDatabase();
    }
  },
  isMySQL: () => dbType === 'mysql',
  isPostgres: () => dbType === 'postgres' || dbType === 'postgresql'
};

export default dbHelper;
