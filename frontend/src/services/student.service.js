import api from './api'
import { createCrudService } from './crudFactory'
const crudService = createCrudService('students')
export const studentService = {
  ...crudService,
  getMe: () => api.get('/students/me').then((res) => res.data),
  createWithAccount: (payload) => api.post('/students/with-account', payload).then((res) => res.data),
}
