import api from './axios'

// ----- Auth -----
export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
}

// ----- Horses -----
export const horseApi = {
  getAll: (params) => api.get('/api/horses', { params }),
  getById: (id) => api.get(`/api/horses/${id}`),
  create: (data) => api.post('/api/horses', data),
  update: (id, data) => api.put(`/api/horses/${id}`, data),
  delete: (id) => api.delete(`/api/horses/${id}`),
  uploadPhoto: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/api/horses/${id}/photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getMedical: (id) => api.get(`/api/horses/${id}/medical`),
  addMedical: (id, data) => api.post(`/api/horses/${id}/medical`, data),
  deleteMedical: (recordId) => api.delete(`/api/horses/medical/${recordId}`),
}

// ----- Employees -----
export const employeeApi = {
  getAll: (params) => api.get('/api/employees', { params }),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (data) => api.post('/api/employees', data),
  update: (id, data) => api.put(`/api/employees/${id}`, data),
  delete: (id) => api.delete(`/api/employees/${id}`),
  getShifts: (id) => api.get(`/api/employees/${id}/shifts`),
  addShift: (id, data) => api.post(`/api/employees/${id}/shifts`, data),
  updateShift: (shiftId, data) => api.put(`/api/employees/shifts/${shiftId}`, data),
  deleteShift: (shiftId) => api.delete(`/api/employees/shifts/${shiftId}`),
  getShiftsByFecha: (fecha) => api.get('/api/employees/shifts/fecha', { params: { fecha } }),
}

// ----- Appointments -----
export const appointmentApi = {
  getAll: (params) => api.get('/api/appointments', { params }),
  getByRango: (inicio, fin) => api.get('/api/appointments/rango', { params: { inicio, fin } }),
  getById: (id) => api.get(`/api/appointments/${id}`),
  create: (data) => api.post('/api/appointments', data),
  update: (id, data) => api.put(`/api/appointments/${id}`, data),
  cancelar: (id) => api.patch(`/api/appointments/${id}/cancelar`),
  reservar: (id) => api.patch(`/api/appointments/${id}/reservar`),
}

// ----- Feeding -----
export const feedingApi = {
  getPlansByHorse: (horseId) => api.get(`/api/feeding/horses/${horseId}/plans`),
  createPlan: (horseId, data) => api.post(`/api/feeding/horses/${horseId}/plans`, data),
  deletePlan: (planId) => api.delete(`/api/feeding/plans/${planId}`),
  getRecords: (planId) => api.get(`/api/feeding/plans/${planId}/records`),
  addRecord: (planId, data) => api.post(`/api/feeding/plans/${planId}/records`, data),
}

// ----- Inventory -----
export const inventoryApi = {
  getAll: (params) => api.get('/api/inventory', { params }),
  getStockBajo: () => api.get('/api/inventory/stock-bajo'),
  getById: (id) => api.get(`/api/inventory/${id}`),
  create: (data) => api.post('/api/inventory', data),
  update: (id, data) => api.put(`/api/inventory/${id}`, data),
  delete: (id) => api.delete(`/api/inventory/${id}`),
}

// ----- Notifications -----
export const notificationApi = {
  getByUser: (userId) => api.get(`/api/notifications/user/${userId}`),
  getNoLeidas: (userId) => api.get(`/api/notifications/user/${userId}/no-leidas`),
  countNoLeidas: (userId) => api.get(`/api/notifications/user/${userId}/count`),
  marcarLeida: (id) => api.patch(`/api/notifications/${id}/leer`),
  marcarTodasLeidas: (userId) => api.patch(`/api/notifications/user/${userId}/leer-todas`),
}
