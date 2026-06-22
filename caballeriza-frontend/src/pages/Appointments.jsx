import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, XCircle, CheckCircle2, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { appointmentApi, horseApi, employeeApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { Spinner, EmptyState, PageHeader, Badge } from '../components/UIBits'

const tipoLabel = { VETERINARIO: 'Veterinario', MONTA: 'Monta', PASEO: 'Paseo', ENTRENAMIENTO: 'Entrenamiento' }
const estadoTone = { PENDIENTE: 'amber', CONFIRMADA: 'green', CANCELADA: 'red', COMPLETADA: 'green' }

export default function Appointments() {
  const { canManage, isCliente } = useAuth()
  const [data, setData] = useState({ content: [], totalPages: 1, number: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const params = { page: p, size: 8 }
      if (tipoFiltro) params.tipo = tipoFiltro
      const res = await appointmentApi.getAll(params)
      setData(res.data.data)
    } catch {
      toast.error('No se pudo cargar la agenda')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, tipoFiltro])

  const handleCancelar = async (id) => {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await appointmentApi.cancelar(id)
      toast.success('Cita cancelada')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo cancelar')
    }
  }

  const handleReservar = async (id) => {
    try {
      await appointmentApi.reservar(id)
      toast.success('Reserva confirmada')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No hay cupos disponibles')
    }
  }

  return (
    <div>
      <PageHeader
        title="Agenda y reservas"
        subtitle="Citas de veterinario, montas, paseos y entrenamiento"
        action={canManage() && (
          <button className="btn-primary flex items-center gap-2" onClick={() => { setSelected(null); setModal('form') }}>
            <Plus className="w-4 h-4" /> Nueva cita
          </button>
        )}
      />

      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-tierra-400" />
        <select className="input max-w-xs" value={tipoFiltro} onChange={(e) => { setTipoFiltro(e.target.value); setPage(0) }}>
          <option value="">Todos los tipos</option>
          {Object.entries(tipoLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : data.content.length === 0 ? <EmptyState label="No hay citas registradas." /> : (
        <>
          <div className="space-y-3">
            {data.content.map((a) => (
              <div key={a.id} className="card card-hover flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone="amber">{tipoLabel[a.tipo] || a.tipo}</Badge>
                    <Badge tone={estadoTone[a.estado] || 'green'}>{a.estado}</Badge>
                  </div>
                  <p className="font-medium text-tierra-800">
                    {new Date(a.fechaInicio).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' })}
                    {' → '}
                    {new Date(a.fechaFin).toLocaleTimeString('es-CR', { timeStyle: 'short' })}
                  </p>
                  <p className="text-sm text-tierra-400">
                    {a.horse ? `Caballo: ${a.horse.nombre}` : ''}
                    {a.employee ? ` · Encargado: ${a.employee.nombre}` : ''}
                  </p>
                  {a.notas && <p className="text-sm text-tierra-500 mt-1">{a.notas}</p>}
                  {a.tipo === 'PASEO' && (
                    <p className="text-xs text-tierra-400 mt-1">Cupo: {a.cupoActual}/{a.cupoMaximo}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {a.tipo === 'PASEO' && a.estado !== 'CANCELADA' && (
                    <button
                      className="btn-secondary text-xs flex items-center gap-1"
                      disabled={a.cupoActual >= a.cupoMaximo}
                      onClick={() => handleReservar(a.id)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reservar
                    </button>
                  )}
                  {canManage() && a.estado !== 'CANCELADA' && (
                    <button className="btn-outline text-xs flex items-center gap-1" onClick={() => handleCancelar(a.id)}>
                      <XCircle className="w-3.5 h-3.5" /> Cancelar
                    </button>
                  )}
                  {canManage() && (
                    <button className="btn-outline text-xs" onClick={() => { setSelected(a); setModal('form') }}>
                      Editar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-outline px-3 py-1.5 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-tierra-500">Página {data.number + 1} de {Math.max(data.totalPages, 1)}</span>
            <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(p => p + 1)} className="btn-outline px-3 py-1.5 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </>
      )}

      {modal === 'form' && (
        <AppointmentFormModal appointment={selected} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}

function toLocalInput(dt) {
  if (!dt) return ''
  return dt.slice(0, 16)
}

function AppointmentFormModal({ appointment, onClose, onSaved }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: appointment ? {
      tipo: appointment.tipo,
      fechaInicio: toLocalInput(appointment.fechaInicio),
      fechaFin: toLocalInput(appointment.fechaFin),
      notas: appointment.notas,
      cupoMaximo: appointment.cupoMaximo,
      horseId: appointment.horse?.id,
      employeeId: appointment.employee?.id,
    } : { tipo: 'VETERINARIO' }
  })
  const [horses, setHorses] = useState([])
  const [employees, setEmployees] = useState([])
  const [saving, setSaving] = useState(false)
  const tipo = watch('tipo')

  useEffect(() => {
    horseApi.getAll({ page: 0, size: 100 }).then(r => setHorses(r.data.data.content))
    employeeApi.getAll({ page: 0, size: 100 }).then(r => setEmployees(r.data.data.content))
  }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        tipo: data.tipo,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        notas: data.notas,
        cupoMaximo: data.tipo === 'PASEO' ? Number(data.cupoMaximo || 1) : null,
        horse: data.horseId ? { id: Number(data.horseId) } : null,
        employee: data.employeeId ? { id: Number(data.employeeId) } : null,
      }
      if (appointment) await appointmentApi.update(appointment.id, payload)
      else await appointmentApi.create(payload)
      toast.success(appointment ? 'Cita actualizada' : 'Cita creada')
      onSaved()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={appointment ? 'Editar cita' : 'Nueva cita'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Tipo de cita</label>
          <select className="input" {...register('tipo')}>
            {Object.entries(tipoLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Inicio</label>
            <input type="datetime-local" className="input" {...register('fechaInicio', { required: true })} />
          </div>
          <div>
            <label className="label">Fin</label>
            <input type="datetime-local" className="input" {...register('fechaFin', { required: true })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Caballo</label>
            <select className="input" {...register('horseId')}>
              <option value="">— Ninguno —</option>
              {horses.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Encargado</label>
            <select className="input" {...register('employeeId')}>
              <option value="">— Ninguno —</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
        </div>
        {tipo === 'PASEO' && (
          <div>
            <label className="label">Cupo máximo de personas</label>
            <input type="number" min="1" className="input" {...register('cupoMaximo', { required: true, min: 1 })} />
          </div>
        )}
        <div>
          <label className="label">Notas</label>
          <textarea className="input" rows={2} {...register('notas')} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  )
}
