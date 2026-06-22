import { Loader2, Inbox } from 'lucide-react'

export function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-tierra-400">
      <Loader2 className="w-5 h-5 animate-spin" /> {label}
    </div>
  )
}

export function EmptyState({ label = 'No hay registros todavía.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-tierra-300">
      <div className="w-14 h-14 rounded-full bg-crema-100 flex items-center justify-center">
        <Inbox className="w-7 h-7" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6 pb-4 border-b border-crema-200 page-enter">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-tierra-800">{title}</h1>
        {subtitle && <p className="text-tierra-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Badge({ tone = 'green', children }) {
  const map = { green: 'badge-green', amber: 'badge-amber', red: 'badge-red' }
  return <span className={map[tone] || 'badge-green'}>{children}</span>
}
