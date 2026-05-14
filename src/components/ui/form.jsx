// Primitives de formulaire — style cohérent pour tous les formulaires CRUD.
const baseField =
  'w-full rounded-xl border border-hairline bg-surface px-3 py-2 text-sm text-content placeholder:text-muted transition-colors focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 disabled:opacity-50'

export function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted"
    >
      {children}
    </label>
  )
}

export function Input({ className = '', ...props }) {
  return <input {...props} className={`${baseField} ${className}`} />
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea {...props} className={`${baseField} resize-none ${className}`} />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select {...props} className={`${baseField} ${className}`}>
      {children}
    </select>
  )
}

// Un champ complet : label + contrôle. `children` = l'input/select/textarea.
export function Field({ label, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
    </div>
  )
}

export function FormActions({ children }) {
  return (
    <div className="mt-5 flex justify-end gap-2 border-t border-hairline pt-4">
      {children}
    </div>
  )
}

export function PrimaryButton({ className = '', children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-brand-yellow px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ className = '', children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl border border-hairline bg-card px-4 py-2 text-sm font-bold text-content transition-colors hover:bg-elevated ${className}`}
    >
      {children}
    </button>
  )
}
