// Tiroir latéral — fiche détaillée d'un membre.
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  CalendarDays,
  RefreshCw,
  Activity,
  Clock,
  Sparkles,
  UserCog,
  Mail,
  Trash2,
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge, { STATUS_VARIANT } from '../ui/Badge'

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Anneau de progression en SVG.
function ProgressRing({ value = 0 }) {
  const size = 132
  const stroke = 11
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  const color = value >= 80 ? '#D2FB52' : value >= 50 ? '#F5D90A' : '#8E7CD9'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-elevated"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-content">{value}%</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Objectif
        </span>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-elevated/60 px-3 py-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-brand-purple">
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-content">{value}</p>
      </div>
    </div>
  )
}

export default function MemberDrawer({ member, onClose, onEdit, onDelete }) {
  return (
    <AnimatePresence>
      {member && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-y-auto border-l border-hairline bg-surface shadow-soft sm:max-w-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            {/* En-tête */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-surface/95 px-5 py-4 backdrop-blur sm:px-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
                Fiche membre
              </h2>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-muted transition-colors hover:bg-card hover:text-content"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-6 px-5 py-6 sm:px-6">
              {/* Identité */}
              <div className="flex flex-col items-center text-center">
                <Avatar src={member.avatar} name={member.name} size="xl" accent="yellow" />
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-content">
                  {member.name}
                </h3>
                <p className="mt-0.5 flex max-w-full items-center gap-1.5 text-sm text-muted">
                  <Mail size={13} className="shrink-0" />
                  <span className="truncate">{member.email}</span>
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
                  <Badge variant="purple">{member.plan}</Badge>
                </div>
              </div>

              {/* Anneau de progression */}
              <div className="flex flex-col items-center rounded-2xl border border-hairline bg-card py-6">
                <ProgressRing value={member.progress} />
                <p className="mt-3 text-xs font-medium text-muted">
                  Progression vers l'objectif personnel
                </p>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-hairline bg-card p-4">
                  <p className="text-2xl font-extrabold text-content">{member.visits}</p>
                  <p className="text-xs font-medium text-muted">Visites totales</p>
                </div>
                <div className="rounded-xl border border-hairline bg-card p-4">
                  <p className="text-lg font-extrabold leading-tight text-content sm:text-xl">
                    {fmtDate(member.lastVisit)}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted">Dernière visite</p>
                </div>
              </div>

              {/* Détails */}
              <div className="flex flex-col gap-2.5">
                <InfoRow icon={Sparkles} label="Cours favori" value={member.favoriteClass} />
                <InfoRow icon={UserCog} label="Coach assigné" value={member.coach} />
                <InfoRow icon={CalendarDays} label="Inscrit le" value={fmtDate(member.joined)} />
                <InfoRow
                  icon={RefreshCw}
                  label="Renouvellement"
                  value={fmtDate(member.renews)}
                />
                <InfoRow icon={Activity} label="Formule" value={member.plan} />
                <InfoRow icon={Clock} label="Statut" value={member.status} />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pb-2">
                <button
                  onClick={() => {
                    onEdit?.(member)
                    onClose()
                  }}
                  className="flex-1 rounded-xl bg-brand-yellow py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDelete?.(member)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-hairline bg-card py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/15"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
