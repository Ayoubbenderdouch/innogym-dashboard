import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Dumbbell,
  Settings,
  LifeBuoy,
  X,
} from 'lucide-react'

const NAV = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/membres', label: 'Membres', icon: Users },
  { to: '/cours', label: 'Cours & Planning', icon: CalendarDays },
  { to: '/coachs', label: 'Coachs', icon: Dumbbell },
]

const SECONDARY = [
  { to: '/parametres', label: 'Paramètres', icon: Settings },
  { to: '/aide', label: 'Aide', icon: LifeBuoy },
]

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-brand-yellow text-black'
            : 'text-muted hover:bg-elevated hover:text-content'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={19} strokeWidth={2.2} />
          <span>{label}</span>
          {isActive && (
            <span className="absolute -left-3 h-5 w-1 rounded-full bg-brand-yellow" />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-hairline bg-surface px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* logo */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1A1A1A] p-1.5">
              <img
                src="/innogym-logo.png"
                alt="InnoGym"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-base font-extrabold tracking-tight text-content">
                Inno<span className="text-brand-yellow">Gym</span>
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                Console Admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-elevated lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* nav */}
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted">
            Pilotage
          </p>
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <p className="px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-widest text-muted">
            Système
          </p>
          {SECONDARY.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* carte promo bas */}
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-soft p-4 text-black">
          <p className="text-sm font-extrabold">InnoGym Pro</p>
          <p className="mt-1 text-xs font-medium opacity-80">
            Débloquez les rapports avancés et l'export comptable.
          </p>
          <button className="mt-3 w-full rounded-lg bg-black/90 py-2 text-xs font-bold text-white transition hover:bg-black">
            Mettre à niveau
          </button>
        </div>
      </aside>
    </>
  )
}
