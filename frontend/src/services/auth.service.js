import api from './api'

/**
 * Backend contract (see backend/src/auth):
 *   POST /api/auth/login    { email, password } -> { accessToken, refreshToken }
 *   POST /api/auth/register { email, password, firstName, lastName, role, phone? } -> { accessToken, refreshToken }
 *   POST /api/auth/refresh  { refreshToken } -> { accessToken, refreshToken }
 *   GET  /api/auth/me       (Bearer token) -> { userId, email, role }
 */
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials).then((res) => res.data),

  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),

  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }).then((res) => res.data),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }).then((res) => res.data),

  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }).then((res) => res.data),

  me: () => api.get('/auth/me').then((res) => res.data),

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
}
