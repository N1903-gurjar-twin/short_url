'use client'

import { useState } from 'react'
import { createShortUrl } from '@/lib/api'
import { CreateUrlResponse, ApiError } from '@/lib/types'
import CopyButton from './copy-button'
import { AlertCircle, Loader } from 'lucide-react'

export default function UrlForm() {
  const [longUrl, setLongUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CreateUrlResponse | null>(null)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!longUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(longUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setIsLoading(true)

    try {
      const response = await createShortUrl(longUrl)
      setResult(response)
      setLongUrl('')
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to create shortened URL')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Shortened URL</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Long URL
          </label>
          <input
            id="url"
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url/path"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Short URL'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">Success!</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Original URL:</p>
                  <p className="text-sm font-mono bg-white p-2 rounded border border-green-200 mt-1 break-all">
                    {result.originalUrl}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shortened URL:</p>
                  <div className="flex gap-2 items-center">
                    <p className="text-sm font-mono bg-white p-2 rounded border border-green-200 flex-1 break-all">
                      {result.shortenedUrl}
                    </p>
                    <CopyButton text={result.shortenedUrl} label="Copy" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
