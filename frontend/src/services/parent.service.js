import api from './api'
import { createCrudService } from './crudFactory'
const crudService = createCrudService('parents')
export const parentService = {
  ...crudService,
  getMe: () => api.get('/parents/me').then((res) => res.data),
  getMyChild: () => api.get('/parents/me/child').then((res) => res.data),
  createWithAccount: (payload) => api.post('/parents/with-account', payload).then((res) => res.data),
}
