import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import publicRoutes from './routes/public.js'
import adminRoutes from './routes/admin.js'
import pool from './db.js'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.use(express.json())

app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

// Serve the invite page with injected window.__INVITE
app.get('/', async (req, res, next) => {
  const { code } = req.query
  if (!code) return next()

  try {
    const [[invite]] = await pool.execute(
      'SELECT * FROM invites WHERE code = ?', [code]
    )
    if (!invite) return next()

    const [members] = await pool.execute(
      'SELECT id, name, confirmed FROM members WHERE invite_id = ?', [invite.id]
    )
    const confirmed_count = members.filter(m => m.confirmed).length
    const inviteData = {
      code: invite.code,
      family_name: invite.family_name,
      members,
      confirmed_count,
      total_members: members.length,
      all_confirmed: confirmed_count === members.length,
    }

    const [gifts] = await pool.execute('SELECT * FROM gifts ORDER BY created_at')

    const indexPath = path.join(__dirname, '../../dist/index.html')
    const { readFileSync } = await import('fs')
    let html = readFileSync(indexPath, 'utf8')
    const inject = `<script>window.__INVITE=${JSON.stringify(inviteData)};window.__GIFTS=${JSON.stringify(gifts)};window.__PIX_KEY=${JSON.stringify(process.env.PIX_KEY || '')};</script>`
    html = html.replace('</head>', inject + '</head>')
    res.send(html)
  } catch (e) {
    next(e)
  }
})

// Serve dist in production
const distPath = path.join(__dirname, '../../dist')
app.use(express.static(distPath))
app.use((_req, res) => res.sendFile(path.join(distPath, 'index.html')))

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server running on :${port}`))
