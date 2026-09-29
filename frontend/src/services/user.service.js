import api from './api'
import { createCrudService } from './crudFactory'
export const userService = {
  ...createCrudService('users'),
  me: () => api.get('/users/me/profile').then(r => r.data),
  uploadAvatar: (file) => { const form = new FormData(); form.append('file', file); return api.post('/users/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data) },
}
