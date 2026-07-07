'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/lib/auth-context'
import { Menu, X, Link2, Sun, Moon, LogOut } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/auth/signin')
  }

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Create URL', href: '/create' },
     ]

  return (
    <nav className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
            <Link2 className="w-6 h-6" />
            <span>LinkShort</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-slate-300" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
            )}

            {/* Auth Actions */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-slate-700 dark:text-slate-300">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-700 pb-4">
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-2 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth Actions */}
            {user ? (
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-4 px-2 space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 px-2">{user.email}</p>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-2 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-4 px-2 space-y-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
