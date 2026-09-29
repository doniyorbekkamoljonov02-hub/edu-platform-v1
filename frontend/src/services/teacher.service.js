import api from './api'
import { createCrudService } from './crudFactory'

const crudService = createCrudService('teachers')

export const teacherService = {
  ...crudService,

  getMe: () =>
    api.get('/teachers/me').then((res) => res.data),

  getMyStudents: () =>
    api.get('/teachers/me/students').then((res) => res.data),
}