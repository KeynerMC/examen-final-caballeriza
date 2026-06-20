import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { employeeApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { Spinner, EmptyState, PageHeader, Badge } from '../components/UIBits'

const rolLabel = { VETERINARIO: 'Veterinario', POTRADOR: 'Potrador', CUIDADOR: 'Cuidador', ADMINISTRADOR: 'Administrador' }

export default function Employees() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState({ content: [], totalPages: 1, number: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await employeeApi.getAll({ page: p, size: 8 })
      setData(res.data.data)
    } catch {
      toast.error('No se pudo cargar el personal')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este empleado?')) return
    try {
      await employeeApi.delete(id)
      toast.success('Empleado eliminado')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo eliminar')
    }
  }

  return (
    <div>
      <PageHeader
        title="Personal"
        subtitle="Veterinarios, cuidadores y administradores"
        action={isAdmin() && (
          <button className="btn-primary flex items-center gap-2" onClick={() => { setSelected(null); setModal('form') }}>
            <Plus className="w-4 h-4" /> Nuevo empleado
          </button>
        )}
      />

      {loading ? <Spinner /> : data.content.length === 0 ? <EmptyState label="No hay empleados registrados." /> : (
        <>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-tierra-400 border-b border-crema-200">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((e) => (
                  <tr key={e.id} className="border-b border-crema-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-tierra-800">{e.nombre}</td>
                    <td className="px-4 py-3"><Badge tone="green">{rolLabel[e.rol] || e.rol}</Badge></td>
                    <td className="px-4 py-3 text-tierra-500">{e.email || '—'} {e.telefono ? `· ${e.telefono}` : ''}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button className="text-tierra-400 hover:text-tierra-700 p-1.5 inline-flex" onClick={() => { setSelected(e); setModal('shifts') }}>
                        <Clock className="w-4 h-4" />
                      </button>
                      {isAdmin() && (
                        <>
                          <button className="text-tierra-400 hover:text-tierra-700 p-1.5 inline-flex" onClick={() => { setSelected(e); setModal('form') }}>
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-600 p-1.5 inline-flex" onClick={() => handleDelete(e.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-outline px-3 py-1.5 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-tierra-500">Página {data.number + 1} de {Math.max(data.totalPages, 1)}</span>
            <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(p => p + 1)} className="btn-outline px-3 py-1.5 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </>
      )}

      {modal === 'form' && (
        <EmployeeFormModal employee={selected} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
      {modal === 'shifts' && (
        <ShiftsModal employee={selected} isAdmin={isAdmin()} onClose={() => setModal(null)} />
      )}
    </div>
  )
}

function EmployeeFormModal({ employee, onClose, onSaved }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: employee || { rol: 'CUIDADOR' } })
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (employee) await employeeApi.update(employee.id, data)
      else await employeeApi.create(data)
      toast.success(employee ? 'Empleado actualizado' : 'Empleado creado')
      onSaved()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={employee ? 'Editar empleado' : 'Nuevo empleado'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Nombre</label>
          <input className="input" {...register('nombre', { required: 'Obligatorio' })} />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="label">Rol</label>
          <select className="input" {...register('rol')}>
            <option value="VETERINARIO">Veterinario</option>
            <option value="POTRADOR">Potrador</option>
            <option value="CUIDADOR">Cuidador</option>
            <option value="ADMINISTRADOR">Administrador</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" {...register('email')} />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input" {...register('telefono')} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  )
}

function ShiftsModal({ employee, isAdmin, onClose }) {
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const load = async () => {
    setLoading(true)
    try {
      const res = await employeeApi.getShifts(employee.id)
      setShifts(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data) => {
    try {
      await employeeApi.addShift(employee.id, data)
      toast.success('Turno asignado')
      reset()
      setShowForm(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este turno?')) return
    await employeeApi.deleteShift(id)
    load()
  }

  return (
    <Modal title={`Turnos de ${employee.nombre}`} onClose={onClose} wide>
      {isAdmin && (
        <div className="mb-4">
          {!showForm ? (
            <button className="btn-secondary text-sm" onClick={() => setShowForm(true)}>+ Asignar turno</button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card bg-crema-50 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Fecha</label>
                  <input type="date" className="input" {...register('fecha', { required: true })} />
                </div>
                <div>
                  <label className="label">Hora inicio</label>
                  <input type="time" className="input" {...register('horaInicio', { required: true })} />
                </div>
                <div>
                  <label className="label">Hora fin</label>
                  <input type="time" className="input" {...register('horaFin', { required: true })} />
                </div>
              </div>
              <div>
                <label className="label">Tareas asignadas</label>
                <textarea className="input" rows={2} {...register('tareas')} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? <Spinner /> : shifts.length === 0 ? <EmptyState label="Sin turnos asignados." /> : (
        <div className="space-y-2">
          {shifts.map((s) => (
            <div key={s.id} className="border border-crema-200 rounded-lg p-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-tierra-800">{s.fecha} · {s.horaInicio} – {s.horaFin}</p>
                {s.tareas && <p className="text-sm text-tierra-500 mt-1">{s.tareas}</p>}
              </div>
              {isAdmin && (
                <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
