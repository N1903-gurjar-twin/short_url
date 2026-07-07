export function SkeletonLoader({ count = 1, variant = 'card' }: { count?: number; variant?: 'card' | 'chart' | 'table' }) {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-slate-700 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  if (variant === 'chart') {
    return <div className="bg-gray-200 dark:bg-slate-700 rounded-lg h-96 animate-pulse" />
  }

  return <div className="bg-gray-200 dark:bg-slate-700 rounded-lg h-64 animate-pulse" />
}
