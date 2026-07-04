import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'convite',
  password: process.env.DB_PASS || 'convite_secret',
  database: process.env.DB_NAME || 'convite',
  waitForConnections: true,
  connectionLimit: 10,
})

export default pool
