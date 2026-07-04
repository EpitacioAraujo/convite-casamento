const base = '/api'

function token() { return localStorage.getItem('admin_token') }

async function req(path, opts = {}) {
  const res = await fetch(base + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...opts.headers,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  if (!res.ok) throw await res.json()
  return res.json()
}

export const api = {
  getInvite: code => req(`/invite/${code}`),
  rsvp: (code, member_ids) => req(`/invite/${code}/rsvp`, { method: 'POST', body: { member_ids } }),
  getGifts: () => req('/gifts'),

  login: (username, password) => req('/admin/login', { method: 'POST', body: { username, password } }),
  adminInvites: () => req('/admin/invites'),
  createInvite: family_name => req('/admin/invites', { method: 'POST', body: { family_name } }),
  updateInvite: (id, family_name) => req(`/admin/invites/${id}`, { method: 'PUT', body: { family_name } }),
  deleteInvite: id => req(`/admin/invites/${id}`, { method: 'DELETE' }),
  addMember: (invite_id, name) => req(`/admin/invites/${invite_id}/members`, { method: 'POST', body: { name } }),
  deleteMember: id => req(`/admin/members/${id}`, { method: 'DELETE' }),
  adminGifts: () => req('/admin/gifts'),
  createGift: gift => req('/admin/gifts', { method: 'POST', body: gift }),
  updateGift: (id, gift) => req(`/admin/gifts/${id}`, { method: 'PUT', body: gift }),
  deleteGift: id => req(`/admin/gifts/${id}`, { method: 'DELETE' }),
  stats: () => req('/admin/stats'),
}
