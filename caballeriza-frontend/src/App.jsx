import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Horses from './pages/Horses'
import Employees from './pages/Employees'
import Appointments from './pages/Appointments'
import Inventory from './pages/Inventory'
import Notifications from './pages/Notifications'
import Feeding from './pages/Feeding'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-tierra-50 flex items-center justify-center">
      <div className="text-tierra-500 text-lg font-serif">Cargando...</div>
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="horses" element={<Horses />} />
        <Route path="employees" element={<Employees />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="feeding" element={<Feeding />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}