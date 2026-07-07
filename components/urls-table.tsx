'use client'

import Link from 'next/link'
import { ShortenedUrl } from '@/lib/types'
import CopyButton from './copy-button'
import { BarChart3 } from 'lucide-react'

interface UrlsTableProps {
  urls: ShortenedUrl[]
  isLoading?: boolean
}

export default function UrlsTable({ urls, isLoading = false }: UrlsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      {urls && urls.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Short Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Original URL
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url.shortCode} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                    <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{url.shortCode}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {url.originalUrl}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex items-center gap-2">
                    <Link
                      href={`/analytics/${url.shortCode}`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-12 text-center text-slate-600 dark:text-slate-400">
          <p>No URLs created yet. Start by creating your first shortened URL.</p>
        </div>
      )}
    </div>
  )
}
