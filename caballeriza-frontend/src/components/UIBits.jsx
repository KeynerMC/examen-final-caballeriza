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
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-tierra-300">
      <Inbox className="w-8 h-8" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
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
