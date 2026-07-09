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
  // ponytail: per-tag manual order; groups blocked together, newest tag-less last
  const [invites] = await pool.execute('SELECT * FROM invites ORDER BY COALESCE(tag, ""), sort_order, created_at DESC')
  const result = await Promise.all(invites.map(async inv => {
    const [members] = await pool.execute(
      'SELECT id, name, confirmed FROM members WHERE invite_id = ?', [inv.id]
    )
    return { ...inv, members }
  }))
  res.json(result)
})

router.post('/invites', async (req, res) => {
  const { family_name, tag } = req.body
  const code = crypto.randomBytes(4).toString('hex').toUpperCase()
  // new invite goes to the end of its group
  const [[{ next }]] = await pool.execute(
    'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM invites WHERE tag <=> ?', [tag || null]
  )
  const [r] = await pool.execute(
    'INSERT INTO invites (code, family_name, tag, sort_order) VALUES (?, ?, ?, ?)', [code, family_name, tag || null, next]
  )
  res.json({ id: r.insertId, code, family_name, tag: tag || null })
})

// persist manual order within a group: body { ids: [inviteId, ...] } in the desired order
router.put('/invites/reorder', async (req, res) => {
  const { ids } = req.body
  await Promise.all(ids.map((id, i) =>
    pool.execute('UPDATE invites SET sort_order = ? WHERE id = ?', [i, id])
  ))
  res.json({ ok: true })
})

router.put('/invites/:id', async (req, res) => {
  const { family_name, tag } = req.body
  await pool.execute('UPDATE invites SET family_name = ?, tag = ? WHERE id = ?', [family_name, tag || null, req.params.id])
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

router.get('/tags', async (_req, res) => {
  const [tags] = await pool.execute('SELECT * FROM tags ORDER BY name')
  res.json(tags)
})

router.post('/tags', async (req, res) => {
  const { name, color } = req.body
  const [r] = await pool.execute('INSERT INTO tags (name, color) VALUES (?, ?)', [name, color || '#c9a227'])
  res.json({ id: r.insertId, name, color: color || '#c9a227' })
})

router.put('/tags/:id', async (req, res) => {
  const { name, color } = req.body
  await pool.execute('UPDATE tags SET name = ?, color = ? WHERE id = ?', [name, color || '#c9a227', req.params.id])
  res.json({ ok: true })
})

router.delete('/tags/:id', async (req, res) => {
  await pool.execute('DELETE FROM tags WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

router.get('/stats', async (req, res) => {
  const { tag } = req.query
  const iWhere = tag ? 'WHERE i.tag = ?' : ''
  const p = tag ? [tag] : []
  const [[{ total_invites }]] = await pool.execute(`SELECT COUNT(*) as total_invites FROM invites i ${iWhere}`, p)
  const [[{ total_members }]] = await pool.execute(`SELECT COUNT(*) as total_members FROM members m JOIN invites i ON i.id = m.invite_id ${iWhere}`, p)
  const [[{ confirmed }]] = await pool.execute(`SELECT COUNT(*) as confirmed FROM members m JOIN invites i ON i.id = m.invite_id ${tag ? 'WHERE i.tag = ? AND' : 'WHERE'} m.confirmed = TRUE`, p)
  res.json({ total_invites, total_members, confirmed, pending: total_members - confirmed })
})

export default router
