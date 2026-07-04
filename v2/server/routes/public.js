import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/invite/:code', async (req, res) => {
  const [[invite]] = await pool.execute(
    'SELECT * FROM invites WHERE code = ?', [req.params.code]
  )
  if (!invite) return res.status(404).json({ error: 'Not found' })

  const [members] = await pool.execute(
    'SELECT id, name, confirmed FROM members WHERE invite_id = ?', [invite.id]
  )
  const confirmed_count = members.filter(m => m.confirmed).length
  res.json({
    code: invite.code,
    family_name: invite.family_name,
    members,
    confirmed_count,
    total_members: members.length,
    all_confirmed: confirmed_count === members.length,
  })
})

router.post('/invite/:code/rsvp', async (req, res) => {
  const [[invite]] = await pool.execute(
    'SELECT * FROM invites WHERE code = ?', [req.params.code]
  )
  if (!invite) return res.status(404).json({ error: 'Not found' })

  const { member_ids } = req.body
  if (!Array.isArray(member_ids) || member_ids.length === 0)
    return res.status(400).json({ error: 'member_ids required' })

  for (const id of member_ids) {
    await pool.execute(
      'UPDATE members SET confirmed = TRUE, confirmed_at = NOW() WHERE id = ? AND invite_id = ?',
      [id, invite.id]
    )
  }
  const [confirmed] = await pool.execute(
    'SELECT id, name FROM members WHERE invite_id = ? AND confirmed = TRUE', [invite.id]
  )
  res.json({ success: true, confirmed })
})

router.get('/gifts', async (_req, res) => {
  const [gifts] = await pool.execute('SELECT * FROM gifts ORDER BY created_at')
  res.json(gifts)
})

export default router
