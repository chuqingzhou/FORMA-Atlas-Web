import Link from 'next/link'
import Image from 'next/image'

interface NavigationProps {
  currentPath?: string
}

export default function Navigation({ currentPath = '/' }: NavigationProps) {
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
          <div className="flex space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors relative group ${
                currentPath === '/' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
              {currentPath === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
              )}
              {currentPath !== '/' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              )}
            </Link>
            <Link 
              href="/browse" 
              className={`font-medium transition-colors relative group ${
                currentPath === '/browse' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Browse Data
              {currentPath === '/browse' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
              )}
              {currentPath !== '/browse' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              )}
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors relative group ${
                currentPath === '/about' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              About
              {currentPath === '/about' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
              )}
              {currentPath !== '/about' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

