import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Star,
  Users,
  Clock,
  CalendarClock,
  Award,
  Activity,
  Heart,
  X,
  Sparkles,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Badge, { STATUS_VARIANT } from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import CoachForm from '../components/coaches/CoachForm'
import { useData } from '../store/DataContext'
import { useToast } from '../store/ToastContext'

const ACCENT = {
  yellow: {
    text: 'text-brand-yellow',
    softBg: 'bg-brand-yellow/15',
    border: 'border-brand-yellow/40',
    topBar: 'bg-brand-yellow',
    glow: 'shadow-[0_0_0_1px_rgba(245,217,10,0.25)]',
    gradient: 'from-brand-yellow/20 via-brand-yellow/5 to-transparent',
    ring: 'ring-brand-yellow/40',
  },
  purple: {
    text: 'text-brand-purple',
    softBg: 'bg-brand-purple/15',
    border: 'border-brand-purple/40',
    topBar: 'bg-brand-purple',
    glow: 'shadow-[0_0_0_1px_rgba(142,124,217,0.25)]',
    gradient: 'from-brand-purple/20 via-brand-purple/5 to-transparent',
    ring: 'ring-brand-purple/40',
  },
  lime: {
    text: 'text-brand-lime',
    softBg: 'bg-brand-lime/15',
    border: 'border-brand-lime/40',
    topBar: 'bg-brand-lime',
    glow: 'shadow-[0_0_0_1px_rgba(210,251,82,0.25)]',
    gradient: 'from-brand-lime/20 via-brand-lime/5 to-transparent',
    ring: 'ring-brand-lime/40',
  },
}

const SORTS = [
  { key: 'rating', label: 'Note' },
  { key: 'members', label: 'Membres' },
  { key: 'years', label: 'Ancienneté' },
]

/* ---- Étoiles : pleines / demi / vides selon la note ---- */
function Stars({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-hairline" strokeWidth={2} />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                className="text-brand-yellow"
                fill="currentColor"
                strokeWidth={2}
              />
            </span>
          </span>
        )
      })}
    </div>
  )
}

/* ---- Petite puce de statistique ---- */
function StatChip({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-elevated px-2 py-2 text-center">
      <Icon size={15} className="text-muted" strokeWidth={2.2} />
      <span className="text-sm font-bold text-content">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</span>
    </div>
  )
}

/* ---- Carte coach ---- */
function CoachCard({ coach, onOpen, onEdit, onDelete }) {
  const a = ACCENT[coach.accent] || ACCENT.yellow
  return (
    <Card
      as="button"
      onClick={() => onOpen(coach)}
      className={`group relative overflow-hidden p-0 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-soft ${a.border}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${a.topBar}`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

      {/* Actions rapides — édition / suppression */}
      <div className="absolute right-3 top-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <span
          role="button"
          tabIndex={0}
          aria-label="Modifier le coach"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(coach)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              onEdit(coach)
            }
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-elevated text-muted transition-colors hover:text-content"
        >
          <Pencil size={13} />
        </span>
        <span
          role="button"
          tabIndex={0}
          aria-label="Supprimer le coach"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(coach)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              onDelete(coach)
            }
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-elevated text-muted transition-colors hover:text-red-500"
        >
          <Trash2 size={13} />
        </span>
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={coach.avatar} name={coach.fullName} size="lg" accent={coach.accent} />
            <div>
              <h3 className="font-bold leading-tight text-content">{coach.fullName}</h3>
              <p className="text-xs text-muted">{coach.title}</p>
            </div>
          </div>
          <Badge variant={STATUS_VARIANT[coach.status] || 'neutral'}>{coach.status}</Badge>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Stars rating={coach.rating} />
          <span className="text-sm font-bold text-content">{coach.rating.toFixed(1)}</span>
          <span className="text-xs text-muted">· {coach.reviews} avis</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <StatChip icon={Users} value={coach.members} label="Membres" />
          <StatChip icon={Heart} value={coach.followers} label="Abonnés" />
          <StatChip icon={Award} value={`${coach.years}a`} label="Exp." />
          <StatChip icon={Clock} value={`${coach.weeklyHours}h`} label="/sem" />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {coach.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-elevated px-2.5 py-1 text-[11px] font-medium text-muted"
            >
              {s}
            </span>
          ))}
        </div>

        <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${a.text}`}>
          Voir le profil
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Card>
  )
}

/* ---- Tiroir détail ---- */
function CoachDrawer({ coach, classes, onClose, onEdit, onDelete }) {
  if (!coach) return null
  const a = ACCENT[coach.accent] || ACCENT.yellow
  const sessions = classes.filter((c) => c.coachId === coach.id)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative h-full w-full max-w-md overflow-y-auto bg-surface shadow-soft"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      >
        {/* En-tête teinté accent */}
        <div className={`relative bg-gradient-to-b ${a.gradient} p-6`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-elevated text-muted transition-colors hover:text-content"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <Avatar src={coach.avatar} name={coach.fullName} size="xl" accent={coach.accent} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-content">{coach.fullName}</h2>
                <Badge variant={STATUS_VARIANT[coach.status] || 'neutral'}>{coach.status}</Badge>
              </div>
              <p className="text-sm text-muted">{coach.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={coach.rating} />
                <span className="text-sm font-bold text-content">{coach.rating.toFixed(1)}</span>
                <span className="text-xs text-muted">({coach.reviews})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Bio */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Biographie</h3>
            <p className="text-sm leading-relaxed text-content">{coach.bio}</p>
          </section>

          {/* Stats numériques */}
          <section className="grid grid-cols-3 gap-2">
            <StatChip icon={Users} value={coach.members} label="Membres" />
            <StatChip icon={Heart} value={coach.followers} label="Abonnés" />
            <StatChip icon={Award} value={`${coach.years} ans`} label="Expérience" />
            <StatChip icon={Clock} value={`${coach.weeklyHours}h`} label="Par sem." />
            <StatChip icon={Star} value={coach.reviews} label="Avis" />
            <StatChip icon={CalendarClock} value={sessions.length} label="Cours" />
          </section>

          {/* Répartition de la note */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Détail de la note
            </h3>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-content">{coach.rating.toFixed(1)}</p>
                  <Stars rating={coach.rating} size={12} />
                  <p className="mt-1 text-[11px] text-muted">{coach.reviews} avis</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const w =
                      star === 5
                        ? coach.rating >= 4.9
                          ? 92
                          : 78
                        : star === 4
                          ? 14
                          : star === 3
                            ? 5
                            : 2
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-3 text-[11px] text-muted">{star}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
                          <div className={`h-full ${a.topBar}`} style={{ width: `${w}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </section>

          {/* Spécialités */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Spécialités</h3>
            <div className="flex flex-wrap gap-2">
              {coach.specialties.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${a.softBg} ${a.text}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Cours affectés */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Cours affectés ({sessions.length})
            </h3>
            <div className="space-y-2">
              {sessions.map((c) => {
                const occ = Math.round((c.placesBooked / c.maxPlaces) * 100)
                const full = c.placesBooked >= c.maxPlaces
                return (
                  <Card key={c.id} className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-content">{c.title}</p>
                        <p className="text-[11px] text-muted">
                          {c.day} · {c.startTime}–{c.endTime} · {c.room}
                        </p>
                      </div>
                      <Badge variant={full ? 'danger' : 'neutral'}>
                        {c.placesBooked}/{c.maxPlaces}
                      </Badge>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
                      <div
                        className={`h-full ${full ? 'bg-red-500' : a.topBar}`}
                        style={{ width: `${occ}%` }}
                      />
                    </div>
                  </Card>
                )
              })}
              {sessions.length === 0 && (
                <p className="text-sm text-muted">Aucun cours affecté.</p>
              )}
            </div>
          </section>

          {/* Actions */}
          <section className="flex gap-2 border-t border-hairline pt-5">
            <button
              onClick={() => onEdit(coach)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              <Pencil size={15} />
              Modifier
            </button>
            <button
              onClick={() => onDelete(coach)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-hairline bg-card px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              Supprimer
            </button>
          </section>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Coaches() {
  const { coaches, classes, deleteCoach } = useData()
  const toast = useToast()
  const [sort, setSort] = useState('rating')
  const [selected, setSelected] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // coach en cours d'édition (null = ajout)
  const [toDelete, setToDelete] = useState(null)

  const stats = useMemo(() => {
    const count = coaches.length || 1
    const actifs = coaches.filter((c) => c.status === 'actif').length
    const avg = coaches.reduce((s, c) => s + (c.rating || 0), 0) / count
    const members = coaches.reduce((s, c) => s + (c.members || 0), 0)
    const hours = coaches.reduce((s, c) => s + (c.weeklyHours || 0), 0)
    return { actifs, avg, members, hours }
  }, [coaches])

  const sorted = useMemo(
    () => [...coaches].sort((a, b) => (b[sort] || 0) - (a[sort] || 0)),
    [coaches, sort],
  )

  const featured = useMemo(
    () => [...coaches].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0],
    [coaches],
  )
  const fa = ACCENT[featured?.accent] || ACCENT.yellow

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (coach) => {
    setSelected(null)
    setEditing(coach)
    setFormOpen(true)
  }
  const askDelete = (coach) => {
    setSelected(null)
    setToDelete(coach)
  }
  const confirmDelete = () => {
    if (toDelete) {
      deleteCoach(toDelete.id)
      toast('Coach supprimé', 'success')
    }
  }

  const metricCards = [
    { icon: Activity, label: 'Coachs actifs', value: `${stats.actifs}/${coaches.length}`, accent: 'lime' },
    { icon: Star, label: 'Note moyenne', value: stats.avg.toFixed(1), accent: 'yellow' },
    { icon: Users, label: 'Membres encadrés', value: stats.members, accent: 'purple' },
    { icon: Clock, label: 'Heures / semaine', value: `${stats.hours}h`, accent: 'lime' },
  ]

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Coachs"
        subtitle={`${coaches.length} coachs • performance et affectations`}
      >
        <div className="flex items-center gap-1 rounded-xl bg-elevated p-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                sort === s.key
                  ? 'bg-brand-yellow text-black'
                  : 'text-muted hover:text-content'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-[1.03]"
        >
          <Plus size={16} strokeWidth={2.6} />
          Nouveau coach
        </button>
      </PageHeader>

      {/* Ligne de KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricCards.map((m) => {
          const a = ACCENT[m.accent]
          return (
            <Card key={m.label} className="p-5 transition-shadow hover:shadow-soft">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.softBg} ${a.text}`}>
                <m.icon size={20} strokeWidth={2.2} />
              </div>
              <p className="mt-4 text-sm font-medium text-muted">{m.label}</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-content">{m.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Coach mis en avant */}
      {featured && (
      <Card className={`relative mt-6 overflow-hidden ${fa.border}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${fa.gradient}`} />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-center gap-5">
            <Avatar src={featured.avatar} name={featured.fullName} size="xl" accent={featured.accent} />
            <div>
              <div className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${fa.softBg} ${fa.text}`}>
                <Sparkles size={12} />
                Coach du moment
              </div>
              <h2 className="text-xl font-extrabold text-content sm:text-2xl">
                {featured.fullName}
              </h2>
              <p className="text-sm text-muted">{featured.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={featured.rating} size={16} />
                <span className="text-sm font-bold text-content">
                  {featured.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted">· {featured.reviews} avis</span>
              </div>
            </div>
          </div>

          <div className="flex-1 sm:border-l sm:border-hairline sm:pl-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatChip icon={Users} value={featured.members} label="Membres" />
              <StatChip icon={Heart} value={featured.followers} label="Abonnés" />
              <StatChip icon={Award} value={`${featured.years} ans`} label="Exp." />
              <StatChip icon={Clock} value={`${featured.weeklyHours}h`} label="/sem" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {featured.specialties.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${fa.softBg} ${fa.text}`}
                >
                  {s}
                </span>
              ))}
            </div>
            <button
              onClick={() => setSelected(featured)}
              className="mt-4 inline-flex items-center gap-1 rounded-xl bg-brand-yellow px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-[1.03]"
            >
              Voir le profil complet
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>
      )}

      {/* Grille des coachs */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((coach) => (
          <CoachCard
            key={coach.id}
            coach={coach}
            onOpen={setSelected}
            onEdit={openEdit}
            onDelete={askDelete}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <Card className="mt-6 p-10 text-center">
          <p className="text-sm text-muted">
            Aucun coach pour le moment. Ajoutez votre premier coach.
          </p>
        </Card>
      )}

      <AnimatePresence>
        {selected && (
          <CoachDrawer
            coach={selected}
            classes={classes}
            onClose={() => setSelected(null)}
            onEdit={openEdit}
            onDelete={askDelete}
          />
        )}
      </AnimatePresence>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Modifier le coach' : 'Nouveau coach'}
        subtitle={
          editing
            ? 'Mettez à jour les informations du coach.'
            : 'Renseignez les informations du nouveau coach.'
        }
        size="lg"
      >
        <CoachForm
          coach={editing}
          onClose={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer le coach"
        message={
          toDelete
            ? `Voulez-vous vraiment supprimer ${toDelete.fullName} ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
      />
    </div>
  )
}
