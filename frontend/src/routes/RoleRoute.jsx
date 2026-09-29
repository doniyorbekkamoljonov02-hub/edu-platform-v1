import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { ROLE_HOME_PATH } from '../constants/roleLabels'

function RoleRoute({ allowedRoles }) {
  const { user } = useAuth()

  // ProtectedRoute ichida ishlatilgani uchun
  // normal holatda user mavjud bo'ladi.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Userning roli ushbu route uchun ruxsat etilmagan.
  if (!allowedRoles.includes(user.role)) {
    const ownHomePath = ROLE_HOME_PATH[user.role]

    if (ownHomePath) {
      return <Navigate to={ownHomePath} replace />
    }

    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RoleRoute