import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 animate-[fadeBackdrop_0.15s_ease-out]" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto animate-[modalPop_0.18s_ease-out]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-crema-200 sticky top-0 bg-white rounded-t-xl">
          <h2 className="font-serif text-lg font-semibold text-tierra-700">{title}</h2>
          <button onClick={onClose} className="text-tierra-400 hover:text-tierra-700 hover:bg-crema-100 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
