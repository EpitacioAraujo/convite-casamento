import pool from './db.js'
import { fileURLToPath } from 'url'

export async function migrate() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS invites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(32) UNIQUE NOT NULL,
      family_name VARCHAR(255) NOT NULL,
      tag VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  // ponytail: idempotent add for existing DBs; MySQL has no ADD COLUMN IF NOT EXISTS
  await pool.execute('ALTER TABLE invites ADD COLUMN tag VARCHAR(255)').catch(() => {})
  await pool.execute('ALTER TABLE invites ADD COLUMN sort_order INT NOT NULL DEFAULT 0').catch(() => {})

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invite_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      confirmed BOOLEAN DEFAULT FALSE,
      confirmed_at TIMESTAMP NULL,
      FOREIGN KEY (invite_id) REFERENCES invites(id)
    )
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS gifts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      value DECIMAL(10,2) NOT NULL,
      link VARCHAR(500),
      chosen_by VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      color VARCHAR(7) NOT NULL DEFAULT '#c9a227',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await migrate()
  console.log('Migrations aplicadas.')
  process.exit(0)
}
