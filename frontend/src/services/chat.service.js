import api from './api'

export const chatService = {
  contacts: () => api.get('/chat/contacts').then((r) => r.data),
  conversations: () => api.get('/chat/conversations').then((r) => r.data),
  createConversation: (userId) => api.post('/chat/conversations', { userId }).then((r) => r.data),
  messages: (id) => api.get(`/chat/conversations/${id}/messages`).then((r) => r.data),
  send: (id, payload) => api.post(`/chat/conversations/${id}/messages`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/chat/messages/${id}`).then((r) => r.data),
  upload: (file) => {
    const data = new FormData()
    data.append('file', file)
    return api.post('/chat/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
}

export function chatEventsUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  return `${base}/chat/events?token=${encodeURIComponent(localStorage.getItem('accessToken') || '')}`
}
