// Mini-courbe SVG autonome (pas de dépendance externe).
export default function Sparkline({ data = [], stroke = '#F5D90A', className = '' }) {
  if (!data.length) return null
  const w = 100
  const h = 32
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return [x, y]
  })
  const line = pts.map((p) => p.join(',')).join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  const id = `sg-${stroke.replace('#', '')}`

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={`h-8 w-full ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
