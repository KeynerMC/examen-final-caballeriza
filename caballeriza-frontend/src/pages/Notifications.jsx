import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Bell, BellOff, CheckCheck, Syringe, Stethoscope, Package, CalendarClock } from 'lucide-react'
import { notificationApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { Spinner, EmptyState, PageHeader } from '../components/UIBits'

const iconMap = { VACUNA: Syringe, TRATAMIENTO: Stethoscope, STOCK_BAJO: Package, CITA: CalendarClock, GENERAL: Bell }

export default function Notifications() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todas')

  const load = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await notificationApi.getByUser(user.id)
      setItems(res.data.data)
    } catch {
      toast.error('No se pudieron cargar las notificaciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user])

  const marcarLeida = async (id) => {
    await notificationApi.marcarLeida(id)
    load()
  }

  const marcarTodas = async () => {
    await notificationApi.marcarTodasLeidas(user.id)
    load()
  }

  const visibles = filter === 'no-leidas' ? items.filter(i => !i.leida) : items

  return (
    <div>
      <PageHeader
        title="Notificaciones"
        subtitle="Vacunaciones próximas, vencimientos y stock bajo"
        action={
          <button onClick={marcarTodas} className="btn-outline flex items-center gap-2 text-sm">
            <CheckCheck className="w-4 h-4" /> Marcar todas como leídas
          </button>
        }
      />

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('todas')} className={`text-sm px-3 py-1.5 rounded-lg ${filter === 'todas' ? 'bg-tierra-600 text-white' : 'bg-crema-100 text-tierra-600'}`}>Todas</button>
        <button onClick={() => setFilter('no-leidas')} className={`text-sm px-3 py-1.5 rounded-lg ${filter === 'no-leidas' ? 'bg-tierra-600 text-white' : 'bg-crema-100 text-tierra-600'}`}>No leídas</button>
      </div>

      {loading ? <Spinner /> : visibles.length === 0 ? <EmptyState label="No tenés notificaciones." /> : (
        <div className="space-y-2">
          {visibles.map((n) => {
            const Icon = iconMap[n.tipo] || Bell
            return (
              <div key={n.id} className={`card card-hover flex items-start gap-3 ${!n.leida ? 'border-tierra-300 bg-crema-50 border-l-4 border-l-tierra-500' : ''}`}>
                <div className={`rounded-lg p-2 shrink-0 ${!n.leida ? 'bg-gradient-to-br from-tierra-400 to-tierra-600 text-white shadow-sm' : 'bg-crema-200 text-tierra-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-tierra-800">{n.titulo}</p>
                  <p className="text-sm text-tierra-500">{n.mensaje}</p>
                  <p className="text-xs text-tierra-300 mt-1">{new Date(n.createdAt).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                {!n.leida && (
                  <button onClick={() => marcarLeida(n.id)} className="text-tierra-400 hover:text-tierra-700" title="Marcar como leída">
                    <BellOff className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
