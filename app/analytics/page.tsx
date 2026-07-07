import Link from 'next/link'
import { BarChart3, Globe, Compass } from 'lucide-react'

export default function AnalyticsPage() {
  const analyticsOptions = [
    {
      title: 'Browser Analytics',
      description: 'See which browsers your users are using',
      href: '/analytics/browser',
      icon: BarChart3,
    },
    {
      title: 'Country Analytics',
      description: 'View geographic distribution of your clicks',
      href: '/analytics/country',
      icon: Globe,
    },
    {
      title: 'Referrer Analytics',
      description: 'Understand where your traffic comes from',
      href: '/analytics/referrer',
      icon: Compass,
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Analytics Hub</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-12">
          Explore detailed analytics across all your shortened URLs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsOptions.map((option) => {
            const Icon = option.icon
            return (
              <Link
                key={option.href}
                href={option.href}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 group transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{option.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{option.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
