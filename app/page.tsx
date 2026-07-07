'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getMyUrls } from '@/lib/api'
import { ShortenedUrl, ChartDataPoint } from '@/lib/types'
import { StatCard } from '@/components/stat-card'
import { SkeletonLoader } from '@/components/skeleton-loader'
import { Plus, TrendingUp, Link as LinkIcon } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [allUrls, setAllUrls] = useState<ShortenedUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyUrls()
        setAllUrls(data)
      } catch (err) {
        setError('Failed to load analytics. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate aggregate stats
  const totalClicks = allUrls.reduce((sum, url) => sum + url.clickCount, 0)
  const totalUrls = allUrls.length

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link href="/create" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              Create a Short URL First
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Analytics Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Track all your shortened URLs performance and gain insights
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <SkeletonLoader count={2} variant="card" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <StatCard
              label="Total URLs"
              value={totalUrls}
              icon={<LinkIcon className="w-8 h-8" />}
            />
            <StatCard
              label="Total Clicks"
              value={totalClicks}
              icon={<TrendingUp className="w-8 h-8" />}
            />
          </div>
        )}

        {/* URLs Table */}
        {isLoading ? (
          <SkeletonLoader count={5} variant="card" />
        ) : allUrls.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Short URL</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Original URL</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Clicks</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Expires</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allUrls.map((url) => {
                    const shortCode = url.shortUrl.split('/').pop() || ''
                    return (
                    <tr key={url.shortUrl} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                        <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs block">{url.shortUrl}</a>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {url.originalUrl}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {url.clickCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(url.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(url.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/analytics/${shortCode}`}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">No shortened URLs created yet</p>
            <Link href="/create" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              Create Your First URL
            </Link>
          </div>
        )}

        {/* CTA */}
        {allUrls.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-8 mt-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Want to create more shortened URLs?</h2>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New URL
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
