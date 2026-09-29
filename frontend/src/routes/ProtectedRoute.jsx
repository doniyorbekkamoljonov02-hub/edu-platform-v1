import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Auth holati hali tekshirilayotgan bo'lsa,
  // hozircha route'ni render qilmaymiz.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#7000FF] rounded-full animate-spin mx-auto mb-3" />

          <p className="text-sm text-gray-500">
            Yuklanmoqda...
          </p>
        </div>
      </div>
    )
  }

  // Login qilmagan userni login sahifasiga yuboramiz.
  // location orqali u qaysi sahifadan kelganini saqlab qo'yamiz.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // Login qilgan user protected sahifalarga kira oladi.
  return <Outlet />
}

export default ProtectedRoute