import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2, Utensils } from 'lucide-react'
import { feedingApi, horseApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { Spinner, EmptyState, PageHeader } from '../components/UIBits'

export default function Feeding() {
  const { canManage } = useAuth()
  const [horses, setHorses] = useState([])
  const [selectedHorse, setSelectedHorse] = useState(null)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [activePlan, setActivePlan] = useState(null)

  useEffect(() => {
    horseApi.getAll({ page: 0, size: 100 }).then(r => {
      const list = r.data.data.content
      setHorses(list)
      if (list.length) setSelectedHorse(list[0].id)
    })
  }, [])

  const loadPlans = async () => {
    if (!selectedHorse) return
    setLoading(true)
    try {
      const res = await feedingApi.getPlansByHorse(selectedHorse)
      setPlans(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPlans() }, [selectedHorse])

  const handleDeletePlan = async (id) => {
    if (!confirm('¿Eliminar este plan de alimentación?')) return
    await feedingApi.deletePlan(id)
    loadPlans()
  }

  return (
    <div>
      <PageHeader
        title="Alimentación"
        subtitle="Planes de alimentación y registro de suministros"
        action={canManage() && selectedHorse && (
          <button className="btn-primary flex items-center gap-2" onClick={() => setModal('plan')}>
            <Plus className="w-4 h-4" /> Nuevo plan
          </button>
        )}
      />

      <div className="mb-4 max-w-xs">
        <label className="label">Caballo</label>
        <select className="input" value={selectedHorse || ''} onChange={(e) => setSelectedHorse(Number(e.target.value))}>
          {horses.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : plans.length === 0 ? <EmptyState label="Este caballo no tiene planes de alimentación." /> : (
        <div className="space-y-4">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} canManage={canManage()} onDelete={() => handleDeletePlan(p.id)} onAddRecord={() => { setActivePlan(p); setModal('record') }} />
          ))}
        </div>
      )}

      {modal === 'plan' && (
        <PlanFormModal horseId={selectedHorse} onClose={() => setModal(null)} onSaved={() => { setModal(null); loadPlans() }} />
      )}
      {modal === 'record' && activePlan && (
        <RecordFormModal plan={activePlan} onClose={() => setModal(null)} onSaved={() => { setModal(null); loadPlans() }} />
      )}
    </div>
  )
}

function PlanCard({ plan, canManage, onDelete, onAddRecord }) {
  const [records, setRecords] = useState([])
  const [open, setOpen] = useState(false)

  const toggle = async () => {
    if (!open) {
      const res = await feedingApi.getRecords(plan.id)
      setRecords(res.data.data)
    }
    setOpen(!open)
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-tierra-800 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-tierra-400" /> {plan.nombre}
          </h3>
          {plan.descripcion && <p className="text-sm text-tierra-500 mt-1">{plan.descripcion}</p>}
        </div>
        {canManage && (
          <button onClick={onDelete} className="text-red-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={toggle} className="btn-outline text-xs">{open ? 'Ocultar suministros' : 'Ver suministros'}</button>
        {canManage && <button onClick={onAddRecord} className="btn-secondary text-xs">+ Registrar suministro</button>}
      </div>
      {open && (
        <div className="mt-3 space-y-2 border-t border-crema-200 pt-3">
          {records.length === 0 ? <p className="text-sm text-tierra-400">Sin suministros registrados.</p> : records.map(r => (
            <div key={r.id} className="text-sm flex justify-between text-tierra-600">
              <span>{r.tipo} — {r.cantidad} {r.unidad}</span>
              <span className="text-tierra-400">{new Date(r.fechaSuministro).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PlanFormModal({ horseId, onClose, onSaved }) {
  const { register, handleSubmit } = useForm()
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await feedingApi.createPlan(horseId, data)
      toast.success('Plan creado')
      onSaved()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Nuevo plan de alimentación" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Nombre del plan</label>
          <input className="input" {...register('nombre', { required: true })} />
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea className="input" rows={3} {...register('descripcion')} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  )
}

function RecordFormModal({ plan, onClose, onSaved }) {
  const { register, handleSubmit } = useForm({ defaultValues: { fechaSuministro: new Date().toISOString().slice(0, 16) } })
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await feedingApi.addRecord(plan.id, { ...data, cantidad: Number(data.cantidad) })
      toast.success('Suministro registrado')
      onSaved()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`Registrar suministro — ${plan.nombre}`} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Tipo de alimento</label>
            <input className="input" {...register('tipo', { required: true })} />
          </div>
          <div>
            <label className="label">Cantidad</label>
            <input type="number" step="0.1" min="0" className="input" {...register('cantidad', { required: true })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Unidad</label>
            <input className="input" placeholder="kg, lb, etc." {...register('unidad')} />
          </div>
          <div>
            <label className="label">Fecha y hora</label>
            <input type="datetime-local" className="input" {...register('fechaSuministro', { required: true })} />
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
