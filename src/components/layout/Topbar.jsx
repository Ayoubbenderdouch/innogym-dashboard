import { Search, Bell, Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../theme/ThemeContext'
import Avatar from '../ui/Avatar'

export default function Topbar({ onMenu }) {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-hairline bg-bg/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-muted hover:bg-elevated lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* recherche */}
      <div className="relative hidden flex-1 sm:block sm:max-w-md">
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Rechercher un membre, un cours, un coach…"
          className="w-full rounded-xl border border-hairline bg-card py-2.5 pl-10 pr-4 text-sm text-content placeholder:text-muted focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* toggle thème */}
        <button
          onClick={toggle}
          aria-label="Basculer le thème"
          className="rounded-xl border border-hairline bg-card p-2.5 text-content transition hover:bg-elevated"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* notifications */}
        <button className="relative rounded-xl border border-hairline bg-card p-2.5 text-content transition hover:bg-elevated">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-yellow ring-2 ring-card" />
        </button>

        {/* profil admin */}
        <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-hairline bg-card py-1.5 pl-1.5 pr-3">
          <Avatar
            src="https://i.pravatar.cc/80?img=68"
            name="Admin InnoGym"
            size="sm"
            accent="yellow"
          />
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-bold text-content">Yacine B.</p>
            <p className="text-[10px] text-muted">Gérant</p>
          </div>
        </div>
      </div>
    </header>
  )
}
