import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { notificationApi } from '../api/services'
import {
  LayoutDashboard, PawPrint, Users, CalendarDays, Package, Utensils, Bell, LogOut, Menu
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/horses', label: 'Caballos', icon: PawPrint },
  { to: '/employees', label: 'Personal', icon: Users, adminOnly: true },
  { to: '/appointments', label: 'Agenda', icon: CalendarDays },
  { to: '/feeding', label: 'Alimentación', icon: Utensils },
  { to: '/inventory', label: 'Inventario', icon: Package },
  { to: '/notifications', label: 'Notificaciones', icon: Bell },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    const fetchCount = () => {
      notificationApi.countNoLeidas(user.id).then(r => setUnread(r.data.data)).catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-tierra-50">
      {/* Sidebar */}
      <aside className={`fixed lg:static z-30 inset-y-0 left-0 w-64 bg-tierra-700 text-crema-50 flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 py-6 border-b border-tierra-600">
          <h1 className="font-serif text-2xl font-bold text-crema-100 flex items-center gap-2">
            <PawPrint className="w-7 h-7 text-crema-200" /> Caballeriza
          </h1>
          <p className="text-tierra-200 text-xs mt-1">Gestión integral</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.filter(i => !i.adminOnly || isAdmin()).map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive ? 'bg-tierra-600 text-crema-50' : 'text-tierra-200 hover:bg-tierra-600/60 hover:text-crema-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
              {label === 'Notificaciones' && unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-tierra-600">
          <div className="text-sm text-crema-100 mb-2 truncate">
            <span className="font-semibold">{user?.nombre}</span>
            <span className="block text-xs text-tierra-300">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-tierra-200 hover:text-crema-50 text-sm">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-crema-200 px-4 py-3">
          <button onClick={() => setOpen(true)}><Menu className="w-6 h-6 text-tierra-700" /></button>
          <h1 className="font-serif text-lg font-bold text-tierra-700">Caballeriza</h1>
          <div className="w-6" />
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
