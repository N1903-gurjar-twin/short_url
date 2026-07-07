'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDetailedAnalytics } from '@/lib/api'
import { DetailedAnalytics, ChartDataPoint } from '@/lib/types'
import { StatCard } from '@/components/stat-card'
import { DailyClicksChart } from '@/components/charts/daily-clicks-chart'
import { DistributionChart } from '@/components/charts/distribution-chart'
import { SkeletonLoader } from '@/components/skeleton-loader'
import { ArrowLeft, BarChart3, Globe, Users, TrendingUp } from 'lucide-react'

export default function AnalyticsDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const shortCode = params.shortCode as string

  const [analytics, setAnalytics] = useState<DetailedAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!shortCode) return

      try {
        const data = await getDetailedAnalytics(shortCode)
        setAnalytics(data)
      } catch (err) {
        setError('Failed to load analytics for this URL')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [shortCode])

  const browserData: ChartDataPoint[] = analytics
    ? Object.entries(analytics.browserStats).map(([name, value]) => ({ name, value }))
    : []

  const countryData: ChartDataPoint[] = analytics
    ? Object.entries(analytics.countryStats).map(([name, value]) => ({ name, value }))
    : []

  const referrerData: ChartDataPoint[] = analytics
    ? Object.entries(analytics.referrerStats).map(([name, value]) => ({ name, value }))
    : []

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>

        {/* Header */}
        {isLoading ? (
          <div className="mb-12">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Analytics for {shortCode}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Detailed performance metrics for this shortened URL
            </p>
          </div>
        )}

        {/* Stats Grid */}
        {isLoading ? (
          <SkeletonLoader count={4} variant="card" />
        ) : analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              label="Total Clicks"
              value={analytics.totalClicks}
              icon={<TrendingUp className="w-8 h-8" />}
            />
            <StatCard
              label="Browser Types"
              value={Object.keys(analytics.browserStats).length}
              icon={<BarChart3 className="w-8 h-8" />}
            />
            <StatCard
              label="Countries"
              value={Object.keys(analytics.countryStats).length}
              icon={<Globe className="w-8 h-8" />}
            />
            <StatCard
              label="Referrer Sources"
              value={Object.keys(analytics.referrerStats).length}
              icon={<Users className="w-8 h-8" />}
            />
          </div>
        ) : null}

        {/* Charts */}
        {isLoading ? (
          <>
            <SkeletonLoader variant="chart" />
            <div className="mt-12">
              <SkeletonLoader count={3} variant="card" />
            </div>
          </>
        ) : analytics ? (
          <>
            <DailyClicksChart data={analytics.dailyClicks} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
              <DistributionChart data={browserData} title="Browser Distribution" />
              <DistributionChart data={countryData} title="Country Distribution" />
              <DistributionChart data={referrerData} title="Referrer Distribution" />
            </div>

            {/* URL Details */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mt-12">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">URL Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-2">Original URL</p>
                  <a
                    href={analytics.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {analytics.originalUrl}
                  </a>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-2">Short Code</p>
                  <code className="text-lg font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {analytics.shortCode}
                  </code>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-2">Created At</p>
                  <p>{new Date(analytics.createdAt).toLocaleDateString()} {new Date(analytics.createdAt).toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-2">Expires At</p>
                  <p>{new Date(analytics.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  )
}
