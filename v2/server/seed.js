import pool from './db.js'
import bcrypt from 'bcryptjs'

await pool.execute(`
  CREATE TABLE IF NOT EXISTS invites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)

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

const hash = await bcrypt.hash('admin123', 10)
await pool.execute(
  `INSERT IGNORE INTO admins (username, password_hash) VALUES (?, ?)`,
  ['admin', hash]
)

console.log('Database seeded.')
process.exit(0)
