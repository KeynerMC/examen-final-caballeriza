import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-lg w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-crema-200 sticky top-0 bg-white">
          <h2 className="font-serif text-lg font-semibold text-tierra-700">{title}</h2>
          <button onClick={onClose} className="text-tierra-400 hover:text-tierra-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
