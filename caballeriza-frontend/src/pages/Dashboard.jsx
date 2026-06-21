import { useEffect, useState } from 'react'
import { PawPrint, Users, CalendarDays, Package, Bell, AlertTriangle } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { horseApi, employeeApi, inventoryApi, notificationApi, dashboardApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/UIBits'

const CHART_COLORS = ['#8b6030', '#3d6b3d', '#d4a43a', '#b8863f', '#7fb07f', '#e8c99a', '#f87171']

const tipoCitaLabel = { VETERINARIO: 'Veterinario', MONTA: 'Monta', PASEO: 'Paseo', ENTRENAMIENTO: 'Entrenamiento' }
const estadoCitaLabel = { PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada', CANCELADA: 'Cancelada', COMPLETADA: 'Completada' }
const rolEmpleadoLabel = { VETERINARIO: 'Veterinario', POTRADOR: 'Potrador', CUIDADOR: 'Cuidador', ADMINISTRADOR: 'Administrador' }
const tipoInsumoLabel = { ALIMENTO: 'Alimento', MEDICINA: 'Medicina', EQUIPAMIENTO: 'Equipamiento', OTRO: 'Otro' }
const tipoRegistroLabel = { VACUNA: 'Vacuna', TRATAMIENTO: 'Tratamiento', ALERGIA: 'Alergia', OBSERVACION: 'Observación' }

function toChartData(map, labelMap = {}) {
  if (!map) return []
  return Object.entries(map).map(([key, value]) => ({ name: labelMap[key] || key, value }))
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [adminStats, setAdminStats] = useState(null)
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

        if (isAdmin()) {
          const res = await dashboardApi.getStats()
          setAdminStats(res.data.data)
        }
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
        <div className="card border-amber-300 bg-amber-50 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-tierra-700">Hay insumos con poco stock</p>
            <p className="text-sm text-tierra-500">Revisá la sección de Inventario para reabastecer a tiempo.</p>
          </div>
        </div>
      )}

      {isAdmin() && adminStats ? (
        <AdminStatsPanel stats={adminStats} />
      ) : (
        <div className="card">
          <h2 className="font-serif text-lg font-semibold text-tierra-700 mb-2 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Accesos rápidos
          </h2>
          <p className="text-sm text-tierra-400">
            Usá el menú lateral para gestionar caballos, personal, agenda de citas y paseos, planes de
            alimentación, inventario de insumos y notificaciones del sistema.
          </p>
        </div>
      )}
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="card">
      <h3 className="font-serif text-base font-semibold text-tierra-700 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

function AdminStatsPanel({ stats }) {
  const citasPorTipo = toChartData(stats.citasPorTipo, tipoCitaLabel)
  const citasPorEstado = toChartData(stats.citasPorEstado, estadoCitaLabel)
  const caballosPorSexo = toChartData(stats.caballosPorSexo, { MACHO: 'Macho', HEMBRA: 'Hembra' })
  const caballosPorRaza = toChartData(stats.caballosPorRaza)
  const empleadosPorRol = toChartData(stats.empleadosPorRol, rolEmpleadoLabel)
  const inventarioPorTipo = toChartData(stats.inventarioPorTipo, tipoInsumoLabel)
  const registrosMedicosPorTipo = toChartData(stats.registrosMedicosPorTipo, tipoRegistroLabel)
  const citasUltimos6Meses = (stats.citasUltimos6Meses || []).map(m => ({ name: m.mes, value: m.total }))

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-2xl font-bold text-tierra-800">{stats.totalClientes}</p>
          <p className="text-xs text-tierra-400">Clientes registrados</p>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-tierra-800">{stats.citasPendientes}</p>
          <p className="text-xs text-tierra-400">Citas pendientes</p>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-tierra-800">{stats.citasHoy}</p>
          <p className="text-xs text-tierra-400">Citas para hoy</p>
        </div>
      </div>

      <h2 className="font-serif text-lg font-semibold text-tierra-700 mb-3">Estadísticas generales</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Citas en los últimos 6 meses">
          <LineChart data={citasUltimos6Meses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0d99e" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" name="Citas" stroke="#8b6030" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Citas por tipo">
          <BarChart data={citasPorTipo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0d99e" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" name="Citas" fill="#3d6b3d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Citas por estado">
          <PieChart>
            <Pie data={citasPorEstado} dataKey="value" nameKey="name" outerRadius={90} label>
              {citasPorEstado.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Caballos por sexo">
          <PieChart>
            <Pie data={caballosPorSexo} dataKey="value" nameKey="name" outerRadius={90} label>
              {caballosPorSexo.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Caballos por raza">
          <BarChart data={caballosPorRaza}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0d99e" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" name="Caballos" fill="#b8863f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Personal por rol">
          <BarChart data={empleadosPorRol}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0d99e" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" name="Empleados" fill="#7fb07f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Inventario por tipo (cantidad)">
          <BarChart data={inventarioPorTipo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0d99e" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" name="Cantidad" fill="#d4a43a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Registros médicos por tipo">
          <PieChart>
            <Pie data={registrosMedicosPorTipo} dataKey="value" nameKey="name" outerRadius={90} label>
              {registrosMedicosPorTipo.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  )
}
