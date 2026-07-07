'use client'

import { useState } from 'react'
import { ShortenedUrl } from '@/lib/types'
import UrlsTable from '@/components/urls-table'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

export default function UrlsPage() {
  const [urls] = useState<ShortenedUrl[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Shortened URLs</h1>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by short code or original URL..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* URLs Table or Empty State */}
        {urls.length > 0 ? (
          <UrlsTable urls={urls} isLoading={false} />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
              No URLs created yet. Start by creating your first shortened URL.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Short URL
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
