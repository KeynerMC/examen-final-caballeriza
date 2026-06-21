import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Stethoscope, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { horseApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { Spinner, EmptyState, PageHeader, Badge } from '../components/UIBits'

const sexoLabel = { MACHO: 'Macho', HEMBRA: 'Hembra' }

export default function Horses() {
  const { canManage, isAdmin } = useAuth()
  const [data, setData] = useState({ content: [], totalPages: 1, number: 0 })
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'create' | 'edit' | 'medical' | null
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(0)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await horseApi.getAll({ page: p, size: 8 })
      setData(res.data.data ?? { content: [], totalPages: 1, number: 0 })
    } catch (e) {
      toast.error('No se pudieron cargar los caballos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este caballo? Esta acción no se puede deshacer.')) return
    try {
      await horseApi.delete(id)
      toast.success('Caballo eliminado')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo eliminar')
    }
  }

  return (
    <div>
      <PageHeader
        title="Caballos"
        subtitle="Administración de la manada"
        action={canManage() && (
          <button className="btn-primary flex items-center gap-2" onClick={() => { setSelected(null); setModal('create') }}>
            <Plus className="w-4 h-4" /> Nuevo caballo
          </button>
        )}
      />

      {loading ? <Spinner /> : data.content.length === 0 ? <EmptyState label="Todavía no hay caballos registrados." /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.content.map((h) => (
              <div key={h.id} className="card flex flex-col">
                <div className="w-full h-36 bg-crema-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  {h.fotoUrl ? (
                    <img src={h.fotoUrl} alt={h.nombre} className="object-cover w-full h-full" />
                  ) : (
                    <Camera className="w-8 h-8 text-tierra-300" />
                  )}
                </div>
                <h3 className="font-serif text-lg font-semibold text-tierra-800">{h.nombre}</h3>
                <p className="text-xs text-tierra-400 mb-2">{h.identificador} · {h.raza}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge tone="green">{sexoLabel[h.sexo] || h.sexo}</Badge>
                  <Badge tone="amber">{h.edad} años</Badge>
                  <Badge tone="amber">{h.peso} kg</Badge>
                </div>
                <div className="mt-auto flex gap-2">
                  <button className="btn-outline text-xs flex-1 flex items-center justify-center gap-1" onClick={() => { setSelected(h); setModal('medical') }}>
                    <Stethoscope className="w-3.5 h-3.5" /> Historial
                  </button>
                  {canManage() && (
                    <button className="text-tierra-400 hover:text-tierra-700 p-2" onClick={() => { setSelected(h); setModal('edit') }}>
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {isAdmin() && (
                    <button className="text-red-400 hover:text-red-600 p-2" onClick={() => handleDelete(h.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-outline px-3 py-1.5 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-tierra-500">Página {data.number + 1} de {Math.max(data.totalPages, 1)}</span>
            <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(p => p + 1)} className="btn-outline px-3 py-1.5 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <HorseFormModal horse={selected} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
      {modal === 'medical' && (
        <MedicalModal horse={selected} canManage={canManage()} onClose={() => setModal(null)} />
      )}
    </div>
  )
}

function HorseFormModal({ horse, onClose, onSaved }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: horse || { sexo: 'MACHO' } })
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, edad: Number(data.edad), peso: Number(data.peso) }
      let saved
      if (horse) {
        saved = (await horseApi.update(horse.id, payload)).data.data
      } else {
        saved = (await horseApi.create(payload)).data.data
      }
      if (file) await horseApi.uploadPhoto(saved.id, file)
      toast.success(horse ? 'Caballo actualizado' : 'Caballo creado')
      onSaved()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={horse ? 'Editar caballo' : 'Nuevo caballo'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Nombre</label>
          <input className="input" {...register('nombre', { required: 'Obligatorio' })} />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="label">Identificador</label>
          <input className="input" {...register('identificador', { required: 'Obligatorio' })} />
          {errors.identificador && <p className="text-red-500 text-xs mt-1">{errors.identificador.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Edad (años)</label>
            <input type="number" min="0" className="input" {...register('edad', { required: true, min: 0 })} />
          </div>
          <div>
            <label className="label">Peso (kg)</label>
            <input type="number" min="0" step="0.1" className="input" {...register('peso', { required: true, min: 0 })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Raza</label>
            <input className="input" {...register('raza', { required: 'Obligatorio' })} />
          </div>
          <div>
            <label className="label">Sexo</label>
            <select className="input" {...register('sexo')}>
              <option value="MACHO">Macho</option>
              <option value="HEMBRA">Hembra</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Foto (opcional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  )
}

const tipoRegistroLabel = { VACUNA: 'Vacuna', TRATAMIENTO: 'Tratamiento', ALERGIA: 'Alergia', OBSERVACION: 'Observación' }

function MedicalModal({ horse, canManage, onClose }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset } = useForm({ defaultValues: { tipo: 'VACUNA' } })

  const load = async () => {
    setLoading(true)
    try {
      const res = await horseApi.getMedical(horse.id)
      setRecords(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data) => {
    try {
      await horseApi.addMedical(horse.id, data)
      toast.success('Registro agregado')
      reset({ tipo: 'VACUNA' })
      setShowForm(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este registro médico?')) return
    await horseApi.deleteMedical(id)
    load()
  }

  return (
    <Modal title={`Historial médico — ${horse.nombre}`} onClose={onClose} wide>
      {canManage && (
        <div className="mb-4">
          {!showForm ? (
            <button className="btn-secondary text-sm" onClick={() => setShowForm(true)}>+ Agregar registro</button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card bg-crema-50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tipo</label>
                  <select className="input" {...register('tipo')}>
                    <option value="VACUNA">Vacuna</option>
                    <option value="TRATAMIENTO">Tratamiento</option>
                    <option value="ALERGIA">Alergia</option>
                    <option value="OBSERVACION">Observación</option>
                  </select>
                </div>
                <div>
                  <label className="label">Responsable</label>
                  <input className="input" {...register('responsable', { required: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Fecha de vencimiento (opcional)</label>
                  <input type="date" className="input" {...register('fechaVencimiento')} />
                </div>
              </div>
              <div>
                <label className="label">Observaciones</label>
                <textarea className="input" rows={2} {...register('observaciones', { required: true })} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? <Spinner /> : records.length === 0 ? <EmptyState label="Sin registros médicos." /> : (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r.id} className="border border-crema-200 rounded-lg p-3 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone={r.tipo === 'ALERGIA' ? 'red' : 'green'}>{tipoRegistroLabel[r.tipo] || r.tipo}</Badge>
                  <span className="text-xs text-tierra-400">{r.fechaRegistro}</span>
                </div>
                <p className="text-sm text-tierra-700">{r.observaciones}</p>
                <p className="text-xs text-tierra-400 mt-1">Responsable: {r.responsable}{r.fechaVencimiento ? ` · Vence: ${r.fechaVencimiento}` : ''}</p>
              </div>
              {canManage && (
                <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600">
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
