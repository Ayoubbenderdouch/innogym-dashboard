import { Construction } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'

export default function Placeholder({ title, subtitle }) {
  return (
    <div className="animate-fade-up">
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow/15 text-brand-yellow">
          <Construction size={26} />
        </div>
        <p className="text-sm font-semibold text-content">Bientôt disponible</p>
        <p className="max-w-xs text-sm text-muted">
          Ce module sera ajouté dans une prochaine itération du tableau de bord.
        </p>
      </Card>
    </div>
  )
}
