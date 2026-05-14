// Avatar avec repli sur les initiales si l'image manque.
const RING = {
  yellow: 'ring-brand-yellow/60',
  purple: 'ring-brand-purple/60',
  lime: 'ring-brand-lime/60',
  none: 'ring-hairline',
}

const SIZES = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base', xl: 'h-20 w-20 text-xl' }

export default function Avatar({ src, name = '', size = 'md', accent = 'none', className = '' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className={`relative shrink-0 rounded-full ring-2 ${RING[accent] || RING.none} ${SIZES[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-elevated font-bold text-muted">
          {initials}
        </div>
      )}
    </div>
  )
}
