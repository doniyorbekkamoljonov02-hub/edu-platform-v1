import api from './api'

/**
 * Builds a standard set of REST calls for a given backend resource path.
 * Every resource service in this folder is a thin wrapper around this,
 * so all of them hit the real backend the same, predictable way.
 *
 * Example: createCrudService('subjects') -> GET/POST /api/subjects, etc.
 */
export function createCrudService(resourcePath) {
  return {
    getAll: (params) => api.get(`/${resourcePath}`, { params }).then((res) => res.data),
    getById: (id) => api.get(`/${resourcePath}/${id}`).then((res) => res.data),
    create: (payload) => api.post(`/${resourcePath}`, payload).then((res) => res.data),
    update: (id, payload) => api.patch(`/${resourcePath}/${id}`, payload).then((res) => res.data),
    remove: (id) => api.delete(`/${resourcePath}/${id}`).then((res) => res.data),
  }
}
