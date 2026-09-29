import { ROLES } from './roles'

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'O‘quvchi',
  [ROLES.TEACHER]: 'O‘qituvchi',
  [ROLES.PARENT]: 'Ota-ona',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.DIRECTOR]: 'Direktor',
}

export const ROLE_HOME_PATH = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.TEACHER]: '/teacher/dashboard',
  [ROLES.PARENT]: '/parent/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.DIRECTOR]: '/director/dashboard',
}
