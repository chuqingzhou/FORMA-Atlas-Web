'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { LogIn, LogOut, User } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="glass-effect border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
            <Image 
              src="/logo.png" 
              alt="FORMA Atlas Logo" 
              width={56} 
              height={56}
                className="object-contain transition-transform group-hover:scale-110"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
              <div className="absolute inset-0 bg-primary-400 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">FORMA Atlas</span>
          </Link>
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors relative group ${
                pathname === '/' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
              )}
              {pathname !== '/' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              )}
            </Link>
            <Link 
              href="/browse" 
              className={`font-medium transition-colors relative group ${
                pathname === '/browse' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Browse Data
              {pathname === '/browse' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
              )}
              {pathname !== '/browse' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              )}
            </Link>
            <Link 
              href="/showcase" 
              className={`font-medium transition-colors relative group ${
                pathname === '/showcase' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Showcase
              {pathname === '/showcase' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
              )}
              {pathname !== '/showcase' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              )}
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors relative group ${
                pathname === '/about' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              About
              {pathname === '/about' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
              )}
              {pathname !== '/about' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              )}
            </Link>
            
            {/* 认证按钮 */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign in</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

