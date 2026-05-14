// Page Membres — annuaire, filtres, fiche détaillée.
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  AlarmClock,
  HeartHandshake,
  Search,
  Plus,
  ChevronRight,
  Pencil,
  Trash2,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge, { STATUS_VARIANT } from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import MemberDrawer from '../components/members/MemberDrawer'
import MemberForm from '../components/members/MemberForm'
import { plans, memberStatuses } from '../data/members'
import { useData } from '../store/DataContext'
import { useToast } from '../store/ToastContext'

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Couleur de la barre de progression selon le palier.
const progressColor = (v) =>
  v >= 80 ? 'bg-brand-lime' : v >= 50 ? 'bg-brand-yellow' : 'bg-brand-purple'

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'bg-brand-yellow text-black'
          : 'bg-elevated text-muted hover:text-content'
      }`}
    >
      {children}
    </button>
  )
}

export default function Members() {
  const { members, deleteMember } = useData()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('tous')
  const [statusFilter, setStatusFilter] = useState('tous')
  const [selected, setSelected] = useState(null)
  // formState : null | { mode: 'add' } | { mode: 'edit', member }
  const [formState, setFormState] = useState(null)
  // confirmTarget : membre en attente de suppression
  const [confirmTarget, setConfirmTarget] = useState(null)

  const handleDelete = (member) => {
    deleteMember(member.id)
    toast('Membre supprimé', 'success')
    if (selected?.id === member.id) setSelected(null)
  }

  // KPIs dérivés de la liste.
  const stats = useMemo(() => {
    const total = members.length
    const actifs = members.filter((m) => m.status === 'actif').length
    const bientot = members.filter((m) => m.status === 'expire bientôt').length
    const expires = members.filter((m) => m.status === 'expiré').length
    // Rétention : part des membres non expirés.
    const retention = total
      ? Math.round(((total - expires) / total) * 100)
      : 0
    return { total, actifs, bientot, retention }
  }, [members])

  // Liste filtrée par recherche + chips.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return members.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      const matchPlan = planFilter === 'tous' || m.plan === planFilter
      const matchStatus = statusFilter === 'tous' || m.status === statusFilter
      return matchSearch && matchPlan && matchStatus
    })
  }, [members, search, planFilter, statusFilter])

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Membres"
        subtitle={`${members.length} membres • gérez les abonnements et le suivi`}
      >
        <button
          onClick={() => setFormState({ mode: 'add' })}
          className="flex items-center gap-1.5 rounded-xl bg-brand-yellow px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={16} strokeWidth={2.6} />
          Nouveau membre
        </button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total membres"
          value={stats.total}
          delta={6}
          trend="up"
          accent="purple"
        />
        <StatCard
          icon={UserCheck}
          label="Membres actifs"
          value={stats.actifs}
          delta={4}
          trend="up"
          accent="lime"
        />
        <StatCard
          icon={AlarmClock}
          label="Expirent bientôt"
          value={stats.bientot}
          delta={2}
          trend="down"
          accent="yellow"
        />
        <StatCard
          icon={HeartHandshake}
          label="Taux de rétention"
          value={stats.retention}
          unit="%"
          delta={3}
          trend="up"
          accent="lime"
        />
      </div>

      {/* Barre d'outils */}
      <Card className="mt-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un membre…"
              className="w-full rounded-xl border border-hairline bg-card py-2 pl-9 pr-3 text-sm text-content placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Formule
            </span>
            <FilterChip
              active={planFilter === 'tous'}
              onClick={() => setPlanFilter('tous')}
            >
              Toutes
            </FilterChip>
            {plans.map((p) => (
              <FilterChip
                key={p}
                active={planFilter === p}
                onClick={() => setPlanFilter(p)}
              >
                {p}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Statut
          </span>
          <FilterChip
            active={statusFilter === 'tous'}
            onClick={() => setStatusFilter('tous')}
          >
            Tous
          </FilterChip>
          {memberStatuses.map((s) => (
            <FilterChip
              key={s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </FilterChip>
          ))}
        </div>
      </Card>

      {/* Résultats */}
      <div className="mt-4 flex items-center justify-between px-1">
        <p className="text-sm text-muted">
          <span className="font-bold text-content">{filtered.length}</span> membre
          {filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-3 flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-elevated text-muted">
            <Search size={24} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-content">Aucun membre trouvé</h3>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Aucun membre ne correspond à votre recherche ou à vos filtres. Essayez
            d'ajuster les critères.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setPlanFilter('tous')
              setStatusFilter('tous')
            }}
            className="mt-4 rounded-xl border border-hairline bg-card px-4 py-2 text-sm font-bold text-content transition-colors hover:bg-elevated"
          >
            Réinitialiser les filtres
          </button>
        </Card>
      ) : (
        <Card className="mt-3 overflow-hidden">
          {/* En-tête de tableau — desktop uniquement */}
          <div className="hidden grid-cols-[2.2fr_1fr_1fr_0.8fr_1.4fr_1fr_auto] gap-4 border-b border-hairline px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted lg:grid">
            <span>Membre</span>
            <span>Formule</span>
            <span>Statut</span>
            <span>Visites</span>
            <span>Progression</span>
            <span>Dernière visite</span>
            <span />
          </div>

          <div className="divide-y divide-hairline">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(m)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(m)
                  }
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.4) }}
                className="group grid w-full cursor-pointer grid-cols-1 items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-elevated/60 focus:outline-none focus-visible:bg-elevated/60 lg:grid-cols-[2.2fr_1fr_1fr_0.8fr_1.4fr_1fr_auto]"
              >
                {/* Membre */}
                <div className="flex items-center gap-3">
                  <Avatar src={m.avatar} name={m.name} size="md" accent="yellow" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-content">{m.name}</p>
                    <p className="truncate text-xs text-muted">{m.email}</p>
                  </div>
                </div>

                {/* Formule */}
                <div>
                  <Badge variant="purple">{m.plan}</Badge>
                </div>

                {/* Statut */}
                <div>
                  <Badge variant={STATUS_VARIANT[m.status]}>{m.status}</Badge>
                </div>

                {/* Visites */}
                <div className="text-sm font-bold text-content">
                  {m.visits}
                  <span className="ml-1 text-xs font-normal text-muted lg:hidden">
                    visites
                  </span>
                </div>

                {/* Progression */}
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-elevated">
                    <div
                      className={`h-full rounded-full ${progressColor(m.progress)}`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs font-semibold text-muted">
                    {m.progress}%
                  </span>
                </div>

                {/* Dernière visite */}
                <div className="text-xs text-muted">{fmtDate(m.lastVisit)}</div>

                {/* Actions + chevron */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFormState({ mode: 'edit', member: m })
                    }}
                    aria-label={`Modifier ${m.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-content lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmTarget(m)
                    }}
                    aria-label={`Supprimer ${m.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/15 hover:text-red-500 lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                  <div className="hidden text-muted lg:flex">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <MemberDrawer
        member={selected}
        onClose={() => setSelected(null)}
        onEdit={(m) => setFormState({ mode: 'edit', member: m })}
        onDelete={(m) => setConfirmTarget(m)}
      />

      {/* Formulaire ajout / édition */}
      <Modal
        open={Boolean(formState)}
        onClose={() => setFormState(null)}
        title={formState?.mode === 'edit' ? 'Modifier le membre' : 'Nouveau membre'}
        subtitle={
          formState?.mode === 'edit'
            ? 'Mettez à jour les informations du membre'
            : 'Ajoutez un nouveau membre à votre salle'
        }
        size="lg"
      >
        {formState && (
          <MemberForm
            member={formState.mode === 'edit' ? formState.member : undefined}
            onClose={() => setFormState(null)}
          />
        )}
      </Modal>

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => handleDelete(confirmTarget)}
        title="Supprimer le membre"
        message={
          confirmTarget
            ? `Voulez-vous vraiment supprimer ${confirmTarget.name} ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
      />
    </div>
  )
}
