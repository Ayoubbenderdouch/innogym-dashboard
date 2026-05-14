import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from './Card'
import Sparkline from './Sparkline'

const ACCENTS = {
  yellow: { text: 'text-brand-yellow', bg: 'bg-brand-yellow/15', stroke: '#F5D90A' },
  purple: { text: 'text-brand-purple', bg: 'bg-brand-purple/15', stroke: '#8E7CD9' },
  lime: { text: 'text-brand-lime', bg: 'bg-brand-lime/15', stroke: '#D2FB52' },
}

// Carte KPI : icône, libellé, valeur, variation, mini-courbe.
export default function StatCard({
  icon: Icon,
  label,
  value,
  unit = '',
  delta,
  trend = 'up',
  spark = [],
  accent = 'yellow',
}) {
  const a = ACCENTS[accent] || ACCENTS.yellow
  const up = trend === 'up'

  return (
    <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-soft">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>
          {Icon && <Icon size={20} strokeWidth={2.2} />}
        </div>
        {delta != null && (
          <span
            className={`flex items-center gap-1 text-xs font-bold ${
              up ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-content">
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          {unit && <span className="ml-1 text-xl">{unit}</span>}
        </p>
      </div>

      {spark.length > 0 && (
        <div className="mt-3 -mb-1">
          <Sparkline data={spark} stroke={a.stroke} />
        </div>
      )}
    </Card>
  )
}
