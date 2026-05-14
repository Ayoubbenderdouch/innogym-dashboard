// Page "Cours & Planning" — planning hebdomadaire + vue liste, filtres et panneau détail.
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  Users,
  Gauge,
  Lock,
  Flame,
  MapPin,
  Clock,
  X,
  LayoutGrid,
  List,
  Dumbbell,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ClassForm from '../components/classes/ClassForm'
import { days, levels } from '../data/classes'
import { coaches } from '../data/coaches'
import { useData } from '../store/DataContext'
import { useToast } from '../store/ToastContext'

const ACCENT = {
  yellow: {
    text: 'text-brand-yellow',
    bar: 'bg-brand-yellow',
    soft: 'bg-brand-yellow/15',
    ring: 'ring-brand-yellow/30',
    border: 'border-l-brand-yellow',
    header: 'bg-brand-yellow',
    headerText: 'text-black',
    stroke: '#F5D90A',
    avatar: 'yellow',
    badge: 'yellow',
  },
  purple: {
    text: 'text-brand-purple',
    bar: 'bg-brand-purple',
    soft: 'bg-brand-purple/15',
    ring: 'ring-brand-purple/30',
    border: 'border-l-brand-purple',
    header: 'bg-brand-purple',
    headerText: 'text-white',
    stroke: '#8E7CD9',
    avatar: 'purple',
    badge: 'purple',
  },
  lime: {
    text: 'text-brand-lime',
    bar: 'bg-brand-lime',
    soft: 'bg-brand-lime/15',
    ring: 'ring-brand-lime/30',
    border: 'border-l-brand-lime',
    header: 'bg-brand-lime',
    headerText: 'text-black',
    stroke: '#D2FB52',
    avatar: 'lime',
    badge: 'lime',
  },
}

const LEVEL_BADGE = {
  Débutant: 'lime',
  Intermédiaire: 'yellow',
  Avancé: 'purple',
}

const coachById = Object.fromEntries(coaches.map((c) => [c.id, c]))
const byTime = (a, b) => a.startTime.localeCompare(b.startTime)

function pct(c) {
  return Math.round((c.placesBooked / c.maxPlaces) * 100)
}

// ---------- Barre d'occupation ----------
function OccupancyBar({ cls, showLabel = true }) {
  const a = ACCENT[cls.accent] || ACCENT.yellow
  const ratio = pct(cls)
  return (
    <div>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
          <span className="text-muted">
            {cls.placesBooked}/{cls.maxPlaces} places
          </span>
          <span className={a.text}>{ratio}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className={`h-full rounded-full ${a.bar} transition-all`}
          style={{ width: `${Math.min(ratio, 100)}%` }}
        />
      </div>
    </div>
  )
}

// ---------- Boutons d'action (éditer / supprimer) ----------
function RowActions({ onEdit, onDelete, className = '' }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        aria-label="Modifier"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-muted transition-colors hover:bg-elevated hover:text-content sm:h-auto sm:w-auto sm:bg-transparent sm:p-1.5"
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        aria-label="Supprimer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-muted transition-colors hover:bg-red-500/15 hover:text-red-500 sm:h-auto sm:w-auto sm:bg-transparent sm:p-1.5"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// ---------- Carte compacte du planning ----------
function ClassCard({ cls, onClick, onEdit, onDelete }) {
  const a = ACCENT[cls.accent] || ACCENT.yellow
  const coach = coachById[cls.coachId]
  const full = cls.placesBooked >= cls.maxPlaces

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-xl border border-hairline border-l-4 ${a.border} bg-surface p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft ${
        full ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold leading-tight text-content">{cls.title}</p>
        <div className="flex shrink-0 items-center gap-1">
          {full && <Badge variant="danger">Complet</Badge>}
          <RowActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted">
        <Clock size={11} />
        {cls.startTime} – {cls.endTime}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <Avatar src={coach?.avatar} name={cls.coach} size="sm" accent={a.avatar} />
        <span className="truncate text-[11px] font-medium text-content">{cls.coach}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={LEVEL_BADGE[cls.level]}>{cls.level}</Badge>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
          <MapPin size={11} />
          {cls.room}
        </span>
      </div>

      <div className="mt-2.5">
        <OccupancyBar cls={cls} />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted">
          <Flame size={12} className="text-orange-500" />
          {cls.calories} kcal
        </span>
        <ChevronRight
          size={14}
          className="text-muted transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </button>
  )
}

// ---------- Ligne de la vue liste ----------
function ClassRow({ cls, onClick, onEdit, onDelete }) {
  const a = ACCENT[cls.accent] || ACCENT.yellow
  const coach = coachById[cls.coachId]
  const full = cls.placesBooked >= cls.maxPlaces

  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-hairline border-l-4 ${a.border} bg-surface px-3 py-2.5 text-left transition-colors hover:bg-elevated md:grid-cols-[88px_1.4fr_1fr_1fr_1.1fr_auto] ${
        full ? 'opacity-70' : ''
      }`}
    >
      <span className="inline-flex items-center gap-1 text-xs font-bold text-content">
        <Clock size={12} className="text-muted" />
        {cls.startTime}
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-content">{cls.title}</p>
        <p className="text-[11px] font-medium text-muted">{cls.category}</p>
      </div>

      <div className="hidden items-center gap-1.5 md:flex">
        <Avatar src={coach?.avatar} name={cls.coach} size="sm" accent={a.avatar} />
        <span className="truncate text-xs font-medium text-content">{cls.coach}</span>
      </div>

      <span className="hidden items-center gap-1 text-xs font-medium text-muted md:flex">
        <MapPin size={12} />
        {cls.room}
      </span>

      <div className="hidden md:block">
        <OccupancyBar cls={cls} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <div className="hidden md:flex">
          {full ? (
            <Badge variant="danger">Complet</Badge>
          ) : (
            <Badge variant={LEVEL_BADGE[cls.level]}>{cls.level}</Badge>
          )}
        </div>
        <RowActions onEdit={onEdit} onDelete={onDelete} />
        <ChevronRight size={14} className="hidden text-muted md:block" />
      </div>
    </button>
  )
}

// ---------- Anneau d'occupation (détail) ----------
function OccupancyRing({ cls }) {
  const a = ACCENT[cls.accent] || ACCENT.yellow
  const ratio = pct(cls)
  const R = 34
  const C = 2 * Math.PI * R
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          strokeWidth="8"
          className="stroke-elevated"
        />
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={a.stroke}
          strokeDasharray={C}
          strokeDashoffset={C - (C * Math.min(ratio, 100)) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-content">{ratio}%</span>
        <span className="text-[10px] font-medium text-muted">rempli</span>
      </div>
    </div>
  )
}

// ---------- Panneau détail ----------
function DetailModal({ cls, onClose, onEdit, onDelete }) {
  const a = ACCENT[cls.accent] || ACCENT.yellow
  const coach = coachById[cls.coachId]
  const full = cls.placesBooked >= cls.maxPlaces
  const left = Math.max(cls.maxPlaces - cls.placesBooked, 0)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-soft sm:max-h-[90vh] sm:rounded-3xl"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête coloré */}
        <div className={`relative shrink-0 ${a.header} px-4 pb-5 pt-5 sm:px-6 sm:pb-6`}>
          <button
            type="button"
            onClick={onClose}
            className={`absolute right-3 top-3 rounded-full bg-black/10 p-1.5 sm:right-4 sm:top-4 ${a.headerText} transition-colors hover:bg-black/20`}
          >
            <X size={16} />
          </button>
          <div className={`flex items-center gap-2 pr-8 text-xs font-bold uppercase tracking-wide ${a.headerText} opacity-80`}>
            <Dumbbell size={14} />
            {cls.category}
          </div>
          <h2 className={`mt-1 pr-8 text-xl font-extrabold sm:text-2xl ${a.headerText}`}>{cls.title}</h2>
          <div className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold ${a.headerText} opacity-90`}>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={14} />
              {cls.day}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {cls.startTime} – {cls.endTime}
            </span>
          </div>
        </div>

        <div className="space-y-5 overflow-y-auto p-4 sm:p-6">
          {/* Coach */}
          <div className="flex items-center gap-3">
            <Avatar src={coach?.avatar} name={cls.coach} size="lg" accent={a.avatar} />
            <div>
              <p className="text-xs font-medium text-muted">Coach</p>
              <p className="text-sm font-bold text-content">{cls.coach}</p>
              {coach && <p className="text-xs text-muted">{coach.title}</p>}
            </div>
          </div>

          {/* Infos clés */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: MapPin, label: 'Salle', value: cls.room },
              { icon: Clock, label: 'Durée', value: `${cls.durationMin} min` },
              { icon: Gauge, label: 'Niveau', value: cls.level },
              { icon: Flame, label: 'Dépense', value: `${cls.calories} kcal` },
            ].map((it) => (
              <div
                key={it.label}
                className="rounded-xl border border-hairline bg-surface p-3"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                  <it.icon size={13} />
                  {it.label}
                </div>
                <p className="mt-0.5 text-sm font-bold text-content">{it.value}</p>
              </div>
            ))}
          </div>

          {/* Occupation */}
          <div className="flex items-center gap-4 rounded-xl border border-hairline bg-surface p-4">
            <OccupancyRing cls={cls} />
            <div className="flex-1">
              <p className="text-sm font-bold text-content">Remplissage</p>
              <p className="mt-0.5 text-xs text-muted">
                {cls.placesBooked} réservées sur {cls.maxPlaces} places
              </p>
              <div className="mt-2.5">
                <OccupancyBar cls={cls} showLabel={false} />
              </div>
              <div className="mt-2">
                {full ? (
                  <Badge variant="danger">
                    <Lock size={11} /> Complet — liste d'attente
                  </Badge>
                ) : (
                  <Badge variant={a.badge}>{left} places restantes</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-hairline pt-4">
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-card px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              Supprimer
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              <Pencil size={15} />
              Modifier
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ---------- Chip de filtre ----------
function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'bg-brand-yellow text-black'
          : 'bg-surface text-muted ring-1 ring-hairline hover:text-content'
      }`}
    >
      {children}
    </button>
  )
}

// ---------- Sélecteur de jour (mobile) ----------
function MobileDayPills({ days, byDay, selected, onSelect }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
      {days.map((d) => {
        const count = byDay[d].length
        const active = selected === d
        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelect(d)}
            className={`flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-4 py-2 transition-colors ${
              active
                ? 'bg-brand-yellow text-black'
                : 'bg-surface text-muted ring-1 ring-hairline'
            }`}
          >
            <span className="text-sm font-bold">{d}</span>
            <span
              className={`text-[10px] font-semibold ${
                active ? 'text-black/70' : 'text-muted'
              }`}
            >
              {count === 0 ? 'Repos' : `${count} séance${count > 1 ? 's' : ''}`}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Classes() {
  const { classes: gymClasses, addClass, updateClass, deleteClass } = useData()
  const toast = useToast()

  const [view, setView] = useState('planning') // planning | liste
  const [level, setLevel] = useState(null)
  const [category, setCategory] = useState(null)
  const [selected, setSelected] = useState(null)
  const [mobileDay, setMobileDay] = useState(days[0])

  // null = fermé | { mode: 'add' } | { mode: 'edit', cls }
  const [formState, setFormState] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const openAdd = () => setFormState({ mode: 'add' })
  const openEdit = (cls) => setFormState({ mode: 'edit', cls })
  const closeForm = () => setFormState(null)

  function handleSubmit(payload) {
    if (formState?.mode === 'edit') {
      updateClass(formState.cls.id, payload)
      toast('Cours mis à jour', 'success')
    } else {
      addClass(payload)
      toast('Cours ajouté', 'success')
    }
    closeForm()
  }

  function confirmDelete() {
    if (!toDelete) return
    deleteClass(toDelete.id)
    toast('Cours supprimé', 'success')
    if (selected?.id === toDelete.id) setSelected(null)
    setToDelete(null)
  }

  const categories = useMemo(
    () => [...new Set(gymClasses.map((c) => c.category))].sort(),
    [gymClasses],
  )

  const stats = useMemo(() => {
    const total = gymClasses.length
    const booked = gymClasses.reduce((s, c) => s + c.placesBooked, 0)
    const avgFill = total
      ? Math.round(
          (gymClasses.reduce((s, c) => s + c.placesBooked / c.maxPlaces, 0) /
            total) *
            100,
        )
      : 0
    const fullCount = gymClasses.filter((c) => c.placesBooked >= c.maxPlaces).length
    return { total, booked, avgFill, fullCount }
  }, [gymClasses])

  const filtered = useMemo(
    () =>
      gymClasses.filter(
        (c) =>
          (!level || c.level === level) && (!category || c.category === category),
      ),
    [gymClasses, level, category],
  )

  const byDay = useMemo(() => {
    const map = Object.fromEntries(days.map((d) => [d, []]))
    filtered.forEach((c) => map[c.day]?.push(c))
    days.forEach((d) => map[d].sort(byTime))
    return map
  }, [filtered])

  const hasResults = filtered.length > 0
  const activeFilters = Boolean(level || category)

  // Garde le jour sélectionné (mobile) valide : retombe sur le 1er jour avec cours.
  useEffect(() => {
    if (byDay[mobileDay] && byDay[mobileDay].length > 0) return
    const firstWithClasses = days.find((d) => byDay[d].length > 0)
    if (firstWithClasses) setMobileDay(firstWithClasses)
  }, [byDay, mobileDay])

  // Le cours affiché dans le détail, resynchronisé avec le store (édition en direct).
  const selectedLive = selected
    ? gymClasses.find((c) => c.id === selected.id) || null
    : null

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Cours & Planning"
        subtitle={`${stats.total} séance${stats.total > 1 ? 's' : ''} cette semaine • suivez le remplissage en temps réel`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-surface p-1 ring-1 ring-hairline">
            {[
              { id: 'planning', label: 'Planning', icon: LayoutGrid },
              { id: 'liste', label: 'Liste', icon: List },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  view === v.id
                    ? 'bg-brand-yellow text-black'
                    : 'text-muted hover:text-content'
                }`}
              >
                <v.icon size={14} />
                {v.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-yellow px-3.5 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Nouveau cours
          </button>
        </div>
      </PageHeader>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Séances cette semaine"
          value={stats.total}
          accent="yellow"
        />
        <StatCard
          icon={Users}
          label="Places réservées"
          value={stats.booked}
          accent="purple"
        />
        <StatCard
          icon={Gauge}
          label="Taux de remplissage moyen"
          value={stats.avgFill}
          unit="%"
          accent="lime"
        />
        <StatCard
          icon={Lock}
          label="Cours complets"
          value={stats.fullCount}
          accent="yellow"
        />
      </div>

      {/* Filtres */}
      <Card className="mt-6 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-muted sm:mr-1">
              Niveau
            </span>
            <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <Chip active={!level} onClick={() => setLevel(null)}>
                Tous
              </Chip>
              {levels.map((l) => (
                <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
                  {l}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-muted sm:mr-1">
              Catégorie
            </span>
            <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <Chip active={!category} onClick={() => setCategory(null)}>
                Toutes
              </Chip>
              {categories.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Contenu */}
      {!hasResults ? (
        <Card className="mt-6 flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-elevated text-muted">
            <CalendarDays size={26} />
          </div>
          <p className="mt-4 text-base font-bold text-content">Aucun cours trouvé</p>
          <p className="mt-1 text-sm text-muted">
            Aucune séance ne correspond à ces filtres.
          </p>
          {activeFilters && (
            <button
              type="button"
              onClick={() => {
                setLevel(null)
                setCategory(null)
              }}
              className="mt-4 rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-bold text-black"
            >
              Réinitialiser les filtres
            </button>
          )}
        </Card>
      ) : view === 'planning' ? (
        // ----- Vue Planning -----
        <div className="mt-6">
          {/* Mobile : sélecteur de jour + cours du jour empilés */}
          <div className="lg:hidden">
            <MobileDayPills
              days={days}
              byDay={byDay}
              selected={mobileDay}
              onSelect={setMobileDay}
            />
            <div className="mt-3 flex flex-col gap-2.5">
              {byDay[mobileDay] && byDay[mobileDay].length > 0 ? (
                byDay[mobileDay].map((cls) => (
                  <ClassCard
                    key={cls.id}
                    cls={cls}
                    onClick={() => setSelected(cls)}
                    onEdit={() => openEdit(cls)}
                    onDelete={() => setToDelete(cls)}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-hairline px-4 py-10 text-center text-xs font-medium text-muted">
                  Aucun cours ce jour — repos
                </div>
              )}
            </div>
          </div>

          {/* Desktop : grille hebdomadaire 7 colonnes */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-7 gap-3">
              {days.map((d) => (
                <div key={d} className="flex flex-col">
                  <div className="mb-2 flex items-center justify-between rounded-xl bg-elevated px-3 py-2">
                    <span className="text-sm font-bold text-content">{d}</span>
                    <span className="text-[11px] font-semibold text-muted">
                      {byDay[d].length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {byDay[d].length === 0 ? (
                      <div className="rounded-xl border border-dashed border-hairline px-3 py-6 text-center text-[11px] font-medium text-muted">
                        Repos
                      </div>
                    ) : (
                      byDay[d].map((cls) => (
                        <ClassCard
                          key={cls.id}
                          cls={cls}
                          onClick={() => setSelected(cls)}
                          onEdit={() => openEdit(cls)}
                          onDelete={() => setToDelete(cls)}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // ----- Vue Liste -----
        <div className="mt-6 space-y-5">
          {days
            .filter((d) => byDay[d].length > 0)
            .map((d) => (
              <div key={d}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-content">
                    {d}
                  </h3>
                  <span className="rounded-full bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">
                    {byDay[d].length} séance{byDay[d].length > 1 ? 's' : ''}
                  </span>
                  <div className="h-px flex-1 bg-hairline" />
                </div>
                <div className="space-y-2">
                  {byDay[d].map((cls) => (
                    <ClassRow
                      key={cls.id}
                      cls={cls}
                      onClick={() => setSelected(cls)}
                      onEdit={() => openEdit(cls)}
                      onDelete={() => setToDelete(cls)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal détail */}
      <AnimatePresence>
        {selectedLive && (
          <DetailModal
            cls={selectedLive}
            onClose={() => setSelected(null)}
            onEdit={() => {
              openEdit(selectedLive)
              setSelected(null)
            }}
            onDelete={() => setToDelete(selectedLive)}
          />
        )}
      </AnimatePresence>

      {/* Formulaire ajout / édition */}
      <Modal
        open={Boolean(formState)}
        onClose={closeForm}
        title={formState?.mode === 'edit' ? 'Modifier le cours' : 'Nouveau cours'}
        subtitle={
          formState?.mode === 'edit'
            ? 'Mettez à jour les informations de la séance.'
            : 'Ajoutez une séance au planning hebdomadaire.'
        }
        size="lg"
      >
        {formState && (
          <ClassForm
            gymClass={formState.mode === 'edit' ? formState.cls : undefined}
            onSubmit={handleSubmit}
            onClose={closeForm}
          />
        )}
      </Modal>

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer le cours"
        message={
          toDelete
            ? `Voulez-vous vraiment supprimer « ${toDelete.title} » ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
      />
    </div>
  )
}
