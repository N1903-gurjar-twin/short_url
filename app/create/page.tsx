'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createShortUrl } from '@/lib/api'
import { CreateUrlRequest, CreateUrlResponse } from '@/lib/types'
import { Copy, Check, Loader } from 'lucide-react'

const QRCode = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
  }
)
export default function CreatePage() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CreateUrlResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get default expiry date (1 year from today)
  const getDefaultExpiryDate = () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    return date.toISOString().split('T')[0]
  }

  // Initialize with default expiry date on mount
  useEffect(() => {
    setExpiryDate(getDefaultExpiryDate())
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!originalUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!expiryDate) {
      setError('Please set an expiry date')
      return
    }

    try {
      setIsLoading(true)
      // Convert date to ISO format with time
      const expiryDateTime = new Date(expiryDate)
      expiryDateTime.setHours(23, 59, 59)
      
      const request: CreateUrlRequest = {
        originalUrl: originalUrl.trim(),
        expiryDate: expiryDateTime.toISOString(),
        
      }
      const response = await createShortUrl(request)
      setResult(response)
      setOriginalUrl('')
      setExpiryDate(getDefaultExpiryDate())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create short URL')
    } finally {
      setIsLoading(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Create Short URL</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Convert your long URLs into short, shareable links
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Original URL Input */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Original URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white outline-none transition"
                  required
                />
              </div>

              {/* Expiry Date Input */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Expiry Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white outline-none transition"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                  The shortened URL will be active until this date
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Short URL'
                )}
              </button>
            </form>
          </div>

          {/* Result Section */}
          {result ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Your Short URL</h2>

              {/* QR Code */}
              <div className="flex justify-center mb-8 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <QRCode
                  value={result.shortUrl || `http://localhost:3000/${result.shortCode}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              {/* Short URL */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Short URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-lg font-mono text-sm break-all">
                      {result.shortUrl || `http://localhost:3000/${result.shortCode}`}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.shortUrl || `http://localhost:3000/${result.shortCode}`)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Original URL */}
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Original URL</p>
                  <a
                    href={result.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
                  >
                    {result.originalUrl}
                  </a>
                </div>

                {/* Short Code */}
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Short Code</p>
                  <code className="block px-4 py-2 bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-mono font-semibold text-center">
                    {result.shortCode}
                  </code>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setResult(null)
                }}
                className="w-full mt-8 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
              >
                Create Another URL
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Fill in the form and create your first short URL to see the result here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
