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
  createInvite: (family_name, tag) => req('/admin/invites', { method: 'POST', body: { family_name, tag } }),
  updateInvite: (id, family_name, tag) => req(`/admin/invites/${id}`, { method: 'PUT', body: { family_name, tag } }),
  deleteInvite: id => req(`/admin/invites/${id}`, { method: 'DELETE' }),
  reorderInvites: ids => req('/admin/invites/reorder', { method: 'PUT', body: { ids } }),
  addMember: (invite_id, name) => req(`/admin/invites/${invite_id}/members`, { method: 'POST', body: { name } }),
  deleteMember: id => req(`/admin/members/${id}`, { method: 'DELETE' }),
  unconfirmInvite: id => req(`/admin/invites/${id}/unconfirm`, { method: 'POST' }),
  adminGifts: () => req('/admin/gifts'),
  createGift: gift => req('/admin/gifts', { method: 'POST', body: gift }),
  updateGift: (id, gift) => req(`/admin/gifts/${id}`, { method: 'PUT', body: gift }),
  deleteGift: id => req(`/admin/gifts/${id}`, { method: 'DELETE' }),
  adminTags: () => req('/admin/tags'),
  createTag: (name, color) => req('/admin/tags', { method: 'POST', body: { name, color } }),
  updateTag: (id, name, color) => req(`/admin/tags/${id}`, { method: 'PUT', body: { name, color } }),
  deleteTag: id => req(`/admin/tags/${id}`, { method: 'DELETE' }),
  stats: tag => req(`/admin/stats${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`),
  adminTemplates: () => req('/admin/templates'),
  createTemplate: (title, body) => req('/admin/templates', { method: 'POST', body: { title, body } }),
  updateTemplate: (id, title, body) => req(`/admin/templates/${id}`, { method: 'PUT', body: { title, body } }),
  deleteTemplate: id => req(`/admin/templates/${id}`, { method: 'DELETE' }),
}
