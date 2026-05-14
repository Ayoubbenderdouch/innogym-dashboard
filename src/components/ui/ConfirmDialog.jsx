// Boîte de confirmation — utilisée avant toute suppression.
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message,
  confirmLabel = 'Supprimer',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
          <AlertTriangle size={20} />
        </div>
        <p className="pt-1 text-sm text-muted">{message}</p>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-hairline pt-4">
        <button
          onClick={onClose}
          className="rounded-xl border border-hairline bg-card px-4 py-2 text-sm font-bold text-content transition-colors hover:bg-elevated"
        >
          Annuler
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
