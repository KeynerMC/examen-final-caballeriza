import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { inventoryApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import { Spinner, EmptyState, PageHeader, Badge } from '../components/UIBits'

const tipoLabel = { ALIMENTO: 'Alimento', MEDICINA: 'Medicina', EQUIPAMIENTO: 'Equipamiento', OTRO: 'Otro' }

export default function Inventory() {
  const { canManage, isAdmin } = useAuth()
  const [data, setData] = useState({ content: [], totalPages: 1, number: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await inventoryApi.getAll({ page: p, size: 8 })
      setData(res.data.data)
    } catch {
      toast.error('No se pudo cargar el inventario')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este insumo?')) return
    try {
      await inventoryApi.delete(id)
      toast.success('Insumo eliminado')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo eliminar')
    }
  }

  return (
    <div>
      <PageHeader
        title="Inventario de insumos"
        subtitle="Alimento, medicinas y equipamiento"
        action={canManage() && (
          <button className="btn-primary flex items-center gap-2" onClick={() => { setSelected(null); setModal('form') }}>
            <Plus className="w-4 h-4" /> Nuevo insumo
          </button>
        )}
      />

      {loading ? <Spinner /> : data.content.length === 0 ? <EmptyState label="No hay insumos registrados." /> : (
        <>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-tierra-400 border-b border-crema-200">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Stock mínimo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((i) => (
                  <tr key={i.id} className="border-b border-crema-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-tierra-800">{i.nombre}</td>
                    <td className="px-4 py-3">{tipoLabel[i.tipo] || i.tipo}</td>
                    <td className="px-4 py-3">{i.cantidad} {i.unidad}</td>
                    <td className="px-4 py-3 text-tierra-500">{i.stockMinimo} {i.unidad}</td>
                    <td className="px-4 py-3">
                      {Number(i.cantidad) <= Number(i.stockMinimo)
                        ? <Badge tone="red"><span className="inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Stock bajo</span></Badge>
                        : <Badge tone="green">OK</Badge>}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {canManage() && (
                        <button className="text-tierra-400 hover:text-tierra-700 p-1.5 inline-flex" onClick={() => { setSelected(i); setModal('form') }}>
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {isAdmin() && (
                        <button className="text-red-400 hover:text-red-600 p-1.5 inline-flex" onClick={() => handleDelete(i.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
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
        <InventoryFormModal item={selected} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}

function InventoryFormModal({ item, onClose, onSaved }) {
  const { register, handleSubmit } = useForm({ defaultValues: item || { tipo: 'ALIMENTO' } })
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, cantidad: Number(data.cantidad), stockMinimo: Number(data.stockMinimo) }
      if (item) await inventoryApi.update(item.id, payload)
      else await inventoryApi.create(payload)
      toast.success(item ? 'Insumo actualizado' : 'Insumo creado')
      onSaved()
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={item ? 'Editar insumo' : 'Nuevo insumo'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Nombre</label>
          <input className="input" {...register('nombre', { required: true })} />
        </div>
        <div>
          <label className="label">Tipo</label>
          <select className="input" {...register('tipo')}>
            {Object.entries(tipoLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Cantidad</label>
            <input type="number" step="0.1" min="0" className="input" {...register('cantidad', { required: true })} />
          </div>
          <div>
            <label className="label">Unidad</label>
            <input className="input" placeholder="kg, unid." {...register('unidad')} />
          </div>
          <div>
            <label className="label">Stock mínimo</label>
            <input type="number" step="0.1" min="0" className="input" {...register('stockMinimo', { required: true })} />
          </div>
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea className="input" rows={2} {...register('descripcion')} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  )
}
