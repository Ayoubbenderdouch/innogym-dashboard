// Notifications "toast" — feedback après une action (ajout, modif, suppression).
import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info }
const COLORS = {
  success: 'text-brand-lime',
  error: 'text-red-500',
  info: 'text-brand-purple',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  )

  // toast('Membre ajouté', 'success' | 'error' | 'info')
  const toast = useCallback(
    (message, type = 'success') => {
      const id = Math.random().toString(36).slice(2)
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => remove(id), 3500)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                className="pointer-events-auto flex items-center gap-3 rounded-xl border border-hairline bg-card px-4 py-3 shadow-soft"
              >
                <Icon size={18} className={COLORS[t.type] || COLORS.info} />
                <span className="text-sm font-semibold text-content">
                  {t.message}
                </span>
                <button
                  onClick={() => remove(t.id)}
                  className="ml-2 text-muted transition-colors hover:text-content"
                >
                  <X size={15} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans <ToastProvider>')
  return ctx
}
