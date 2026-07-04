import { Router } from 'express'
import pool from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth.js'
import crypto from 'crypto'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const [[admin]] = await pool.execute(
    'SELECT * FROM admins WHERE username = ?', [username]
  )
  if (!admin || !(await bcrypt.compare(password, admin.password_hash)))
    return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ id: admin.id, username }, process.env.JWT_SECRET, { expiresIn: '24h' })
  res.json({ token })
})

// All routes below require auth
router.use(auth)

router.get('/invites', async (_req, res) => {
  const [invites] = await pool.execute('SELECT * FROM invites ORDER BY created_at DESC')
  const result = await Promise.all(invites.map(async inv => {
    const [members] = await pool.execute(
      'SELECT id, name, confirmed FROM members WHERE invite_id = ?', [inv.id]
    )
    return { ...inv, members }
  }))
  res.json(result)
})

router.post('/invites', async (req, res) => {
  const { family_name } = req.body
  const code = crypto.randomBytes(4).toString('hex').toUpperCase()
  const [r] = await pool.execute(
    'INSERT INTO invites (code, family_name) VALUES (?, ?)', [code, family_name]
  )
  res.json({ id: r.insertId, code, family_name })
})

router.put('/invites/:id', async (req, res) => {
  const { family_name } = req.body
  await pool.execute('UPDATE invites SET family_name = ? WHERE id = ?', [family_name, req.params.id])
  res.json({ ok: true })
})

router.delete('/invites/:id', async (req, res) => {
  await pool.execute('DELETE FROM members WHERE invite_id = ?', [req.params.id])
  await pool.execute('DELETE FROM invites WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

router.post('/invites/:id/members', async (req, res) => {
  const { name } = req.body
  const [r] = await pool.execute(
    'INSERT INTO members (invite_id, name) VALUES (?, ?)', [req.params.id, name]
  )
  res.json({ id: r.insertId, name, confirmed: false })
})

router.delete('/members/:id', async (req, res) => {
  await pool.execute('DELETE FROM members WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

router.get('/gifts', async (_req, res) => {
  const [gifts] = await pool.execute('SELECT * FROM gifts ORDER BY created_at')
  res.json(gifts)
})

router.post('/gifts', async (req, res) => {
  const { name, value, link } = req.body
  const [r] = await pool.execute(
    'INSERT INTO gifts (name, value, link) VALUES (?, ?, ?)', [name, value, link || null]
  )
  res.json({ id: r.insertId, name, value, link, chosen_by: null })
})

router.put('/gifts/:id', async (req, res) => {
  const { name, value, link, chosen_by } = req.body
  await pool.execute(
    'UPDATE gifts SET name=?, value=?, link=?, chosen_by=? WHERE id=?',
    [name, value, link || null, chosen_by || null, req.params.id]
  )
  res.json({ ok: true })
})

router.delete('/gifts/:id', async (req, res) => {
  await pool.execute('DELETE FROM gifts WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

router.get('/stats', async (_req, res) => {
  const [[{ total_invites }]] = await pool.execute('SELECT COUNT(*) as total_invites FROM invites')
  const [[{ total_members }]] = await pool.execute('SELECT COUNT(*) as total_members FROM members')
  const [[{ confirmed }]] = await pool.execute('SELECT COUNT(*) as confirmed FROM members WHERE confirmed = TRUE')
  res.json({ total_invites, total_members, confirmed, pending: total_members - confirmed })
})

export default router
