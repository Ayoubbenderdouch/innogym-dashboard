// Conteneur de base réutilisable. bg-card / hairline s'adaptent au thème.
export default function Card({ className = '', as: Tag = 'div', children, ...props }) {
  return (
    <Tag
      className={`bg-card border border-hairline rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
