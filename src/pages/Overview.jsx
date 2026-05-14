// Tableau de bord — vue d'ensemble analytique de la salle InnoGym.
import { useState, useEffect } from 'react'
import {
  Users,
  Wallet,
  CalendarDays,
  Activity,
  ChevronDown,
  ArrowUpRight,
  UserPlus,
  CalendarCheck,
  RefreshCw,
  Lock,
  CreditCard,
  CalendarX,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
} from 'recharts'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { useTheme } from '../theme/ThemeContext'
import {
  kpis,
  visitsByMonth,
  revenueByPlan,
  trafficByHour,
  classCategories,
  recentActivity,
  monthlyGoals,
} from '../data/analytics'

const KPI_ICONS = {
  members: Users,
  revenue: Wallet,
  classes: CalendarDays,
  occupancy: Activity,
}
const KPI_ACCENTS = ['yellow', 'purple', 'lime', 'yellow']

const ACTIVITY_ICONS = {
  inscription: UserPlus,
  réservation: CalendarCheck,
  renouvellement: RefreshCw,
  'cours complet': Lock,
  paiement: CreditCard,
  expiration: CalendarX,
}

const ACCENT_DOT = {
  yellow: 'bg-brand-yellow',
  purple: 'bg-brand-purple',
  lime: 'bg-brand-lime',
}
const ACCENT_TEXT = {
  yellow: 'text-brand-yellow',
  purple: 'text-brand-purple',
  lime: 'text-[#7a9400] dark:text-brand-lime',
}
const ACCENT_SOFT = {
  yellow: 'bg-brand-yellow/15',
  purple: 'bg-brand-purple/15',
  lime: 'bg-brand-lime/15',
}

const PERIODS = ['7 jours', '30 jours', '12 mois']

// Détecte les petits écrans (téléphones) pour adapter les graphiques.
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isMobile
}

function ChartTooltip({ active, payload, label, bg, suffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl border border-hairline px-3 py-2 text-xs shadow-soft"
      style={{ background: bg }}
    >
      <p className="mb-1 font-bold text-content">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-muted">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color || p.fill || p.stroke }}
          />
          <span className="font-semibold text-content">
            {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}
            {suffix}
          </span>
          <span className="capitalize">{p.name}</span>
        </p>
      ))}
    </div>
  )
}

export default function Overview() {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const [period, setPeriod] = useState(PERIODS[2])
  const [periodOpen, setPeriodOpen] = useState(false)

  const gridColor = theme === 'dark' ? '#303032' : '#E8E8EB'
  const axisColor = theme === 'dark' ? '#8B8B91' : '#7A7A82'
  const tooltipBg = theme === 'dark' ? '#222222' : '#FFFFFF'

  const totalRevenue = revenueByPlan.reduce((s, p) => s + p.value, 0)
  const maxCat = Math.max(...classCategories.map((c) => c.sessions))

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre salle — 14 mai 2026"
      >
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setPeriodOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-card px-3.5 py-2 text-sm font-semibold text-content transition-colors hover:bg-elevated sm:w-auto sm:justify-start"
          >
            <CalendarDays size={16} className="text-brand-purple" />
            {period}
            <ChevronDown
              size={15}
              className={`text-muted transition-transform ${periodOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {periodOpen && (
            <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-hairline bg-elevated shadow-soft sm:w-40">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p)
                    setPeriodOpen(false)
                  }}
                  className={`block w-full px-3.5 py-2 text-left text-sm transition-colors hover:bg-card ${
                    p === period ? 'font-bold text-brand-purple' : 'text-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <StatCard
            key={k.id}
            icon={KPI_ICONS[k.id] || Activity}
            label={k.label}
            value={k.value}
            unit={k.unit}
            delta={k.delta}
            trend={k.trend}
            spark={k.spark}
            accent={KPI_ACCENTS[i % KPI_ACCENTS.length]}
          />
        ))}
      </div>

      {/* Main bento grid */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3">
        {/* Fréquentation mensuelle — wide */}
        <Card className="p-4 sm:p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
            <div>
              <h2 className="text-base font-bold text-content">
                Fréquentation mensuelle
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                Visites et nouveaux membres sur 12 mois
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold sm:gap-4">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-yellow" />
                Visites
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-purple" />
                Nouveaux membres
              </span>
            </div>
          </div>
          <div className="mt-4 h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={visitsByMonth}
                margin={{ top: 8, right: 4, bottom: 0, left: -16 }}
              >
                <defs>
                  <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5D90A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#F5D90A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={false}
                  fontSize={isMobile ? 10 : 12}
                  interval={isMobile ? 1 : 0}
                  tickMargin={6}
                />
                <YAxis
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={false}
                  fontSize={isMobile ? 10 : 12}
                  width={isMobile ? 32 : 40}
                />
                <Tooltip
                  cursor={{ stroke: gridColor }}
                  content={<ChartTooltip bg={tooltipBg} />}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="visites"
                  stroke="#F5D90A"
                  strokeWidth={2.5}
                  fill="url(#visitsFill)"
                />
                <Bar
                  dataKey="newMembers"
                  name="nouveaux membres"
                  barSize={isMobile ? 9 : 14}
                  radius={[4, 4, 0, 0]}
                  fill="#8E7CD9"
                />
                <Line
                  type="monotone"
                  dataKey="newMembers"
                  name="nouveaux membres"
                  stroke="#8E7CD9"
                  strokeWidth={0}
                  dot={false}
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenu par formule — donut */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-base font-bold text-content">Revenu par formule</h2>
          <p className="mt-0.5 text-sm text-muted">Répartition du chiffre d'affaires</p>
          <div className="relative mt-2 h-48 sm:h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  dataKey="value"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="86%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {revenueByPlan.map((p) => (
                    <Cell key={p.plan} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip bg={tooltipBg} suffix=" DZD" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-medium text-muted">Total</span>
              <span className="text-xl font-extrabold text-content">
                {(totalRevenue / 1e6).toLocaleString('fr-FR', {
                  maximumFractionDigits: 2,
                })}{' '}
                M
              </span>
              <span className="text-[10px] font-semibold text-muted">DZD</span>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {revenueByPlan.map((p) => (
              <div
                key={p.plan}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-muted">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="truncate">{p.plan}</span>
                </span>
                <span className="shrink-0 font-semibold text-content">
                  {p.value.toLocaleString('fr-FR')} DZD
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Second bento row */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3">
        {/* Affluence par créneau — bar */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-base font-bold text-content">Affluence par créneau</h2>
          <p className="mt-0.5 text-sm text-muted">Présence moyenne sur une journée type</p>
          <div className="mt-4 h-52 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trafficByHour}
                margin={{ top: 8, right: 4, bottom: 0, left: -20 }}
              >
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={false}
                  fontSize={isMobile ? 10 : 11}
                  interval={isMobile ? 1 : 0}
                  tickMargin={6}
                />
                <YAxis
                  stroke={axisColor}
                  tickLine={false}
                  axisLine={false}
                  fontSize={isMobile ? 10 : 11}
                  width={isMobile ? 30 : 40}
                />
                <Tooltip
                  cursor={{ fill: theme === 'dark' ? '#2a2a2a' : '#F2F2F4' }}
                  content={<ChartTooltip bg={tooltipBg} suffix=" pers." />}
                />
                <Bar dataKey="value" name="affluence" radius={[6, 6, 0, 0]}>
                  {trafficByHour.map((t) => (
                    <Cell
                      key={t.hour}
                      fill={t.value >= 70 ? '#F5D90A' : '#8E7CD9'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Répartition des cours — horizontal bars */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-base font-bold text-content">Répartition des cours</h2>
          <p className="mt-0.5 text-sm text-muted">Sessions par catégorie cette semaine</p>
          <div className="mt-4 space-y-3.5">
            {classCategories.map((c) => (
              <div key={c.category}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-content">{c.category}</span>
                  <span className="font-semibold text-muted">{c.sessions}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(c.sessions / maxCat) * 100}%`,
                      background: c.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activité récente — feed */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-content">Activité récente</h2>
            <Badge variant="purple">Live</Badge>
          </div>
          <div className="mt-4 space-y-1">
            {recentActivity.map((a, i) => {
              const Icon = ACTIVITY_ICONS[a.type] || Activity
              const last = i === recentActivity.length - 1
              return (
                <div key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ACCENT_SOFT[a.accent]} ${ACCENT_TEXT[a.accent]}`}
                    >
                      <Icon size={15} strokeWidth={2.2} />
                    </span>
                    {!last && <span className="my-1 w-px flex-1 bg-hairline" />}
                  </div>
                  <div className={`min-w-0 ${last ? '' : 'pb-3'}`}>
                    <p className="text-sm leading-snug text-content">
                      <span className="font-semibold">{a.who}</span>{' '}
                      <span className="text-muted">{a.detail}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{a.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Objectifs du mois — full width */}
      <Card className="mt-3 p-4 sm:mt-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-content">Objectifs du mois</h2>
            <p className="mt-0.5 text-sm text-muted">
              Progression vers les cibles de mai 2026
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-brand-purple">
            <ArrowUpRight size={14} />
            En bonne voie
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {monthlyGoals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100))
            return (
              <div key={g.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-content">{g.label}</span>
                  <span className="text-xs font-bold text-muted">{pct}%</span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-brand-yellow transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  <span className="font-semibold text-content">
                    {g.current.toLocaleString('fr-FR')}
                  </span>{' '}
                  / {g.target.toLocaleString('fr-FR')}
                </p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
