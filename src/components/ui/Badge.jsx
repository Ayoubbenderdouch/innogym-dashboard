// Pastille de statut. Mappe les statuts métier vers une couleur de marque.
const VARIANTS = {
  yellow: 'bg-brand-yellow/15 text-brand-yellow ring-1 ring-brand-yellow/30',
  purple: 'bg-brand-purple/15 text-brand-purple ring-1 ring-brand-purple/30',
  lime: 'bg-brand-lime/15 text-[#7a9400] dark:text-brand-lime ring-1 ring-brand-lime/30',
  neutral: 'bg-elevated text-muted ring-1 ring-hairline',
  danger: 'bg-red-500/15 text-red-500 ring-1 ring-red-500/30',
}

// Statuts métier -> variante
export const STATUS_VARIANT = {
  actif: 'lime',
  'expire bientôt': 'yellow',
  expiré: 'danger',
  gelé: 'neutral',
  congé: 'neutral',
  complet: 'danger',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  const v = VARIANTS[variant] || VARIANTS.neutral
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${v} ${className}`}
    >
      {children}
    </span>
  )
}
