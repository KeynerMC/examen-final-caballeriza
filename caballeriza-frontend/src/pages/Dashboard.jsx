import { useEffect, useState } from 'react'
import { PawPrint, Users, CalendarDays, Package, Bell, AlertTriangle } from 'lucide-react'
import { horseApi, employeeApi, inventoryApi, notificationApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/UIBits'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [horses, employees, stockBajo, unread] = await Promise.all([
          horseApi.getAll({ page: 0, size: 1 }),
          employeeApi.getAll({ page: 0, size: 1 }),
          inventoryApi.getStockBajo(),
          user?.id ? notificationApi.countNoLeidas(user.id) : Promise.resolve({ data: { data: 0 } }),
        ])
        setStats({
          horses: horses.data.data.totalElements,
          employees: employees.data.data.totalElements,
          stockBajo: stockBajo.data.data.length,
          unread: unread.data.data,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) return <Spinner />

  const cards = [
    { label: 'Caballos registrados', value: stats?.horses ?? 0, icon: PawPrint, color: 'bg-tierra-500' },
    { label: 'Personal activo', value: stats?.employees ?? 0, icon: Users, color: 'bg-salvia-500' },
    { label: 'Insumos con stock bajo', value: stats?.stockBajo ?? 0, icon: Package, color: 'bg-amber-500' },
    { label: 'Notificaciones sin leer', value: stats?.unread ?? 0, icon: Bell, color: 'bg-red-400' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-tierra-800">
          Hola, {user?.nombre?.split(' ')[0]} 👋
        </h1>
        <p className="text-tierra-400 text-sm mt-1">Resumen general de la caballeriza</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`${color} text-white rounded-xl p-3`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tierra-800">{value}</p>
              <p className="text-xs text-tierra-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {stats?.stockBajo > 0 && (
        <div className="card border-amber-300 bg-amber-50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-tierra-700">Hay insumos con poco stock</p>
            <p className="text-sm text-tierra-500">Revisá la sección de Inventario para reabastecer a tiempo.</p>
          </div>
        </div>
      )}

      <div className="card mt-6">
        <h2 className="font-serif text-lg font-semibold text-tierra-700 mb-2 flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Accesos rápidos
        </h2>
        <p className="text-sm text-tierra-400">
          Usá el menú lateral para gestionar caballos, personal, agenda de citas y paseos, planes de
          alimentación, inventario de insumos y notificaciones del sistema.
        </p>
      </div>
    </div>
  )
}
