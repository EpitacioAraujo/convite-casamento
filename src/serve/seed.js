import pool from './db.js'
import bcrypt from 'bcryptjs'

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

// ponytail: invites.tag stores the name (denormalized); no rename cascade, fine for a handful of groups
for (const [name, color] of [
  ['Minha família', '#c9a227'], ['Família dela', '#b5651d'],
  ['Meus amigos', '#2e7d67'], ['Amigos dela', '#7b5ea7'], ['Nossos amigos', '#c05579'],
]) await pool.execute('INSERT IGNORE INTO tags (name, color) VALUES (?, ?)', [name, color])

const hash = await bcrypt.hash('admin123', 10)
await pool.execute(
  `INSERT IGNORE INTO admins (username, password_hash) VALUES (?, ?)`,
  ['admin', hash]
)

console.log('Database seeded.')
process.exit(0)
