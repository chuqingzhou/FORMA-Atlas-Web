import Link from 'next/link'
import Image from 'next/image'

interface NavigationProps {
  currentPath?: string
}

export default function Navigation({ currentPath = '/' }: NavigationProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="FORMA Atlas Logo" 
              width={56} 
              height={56}
              className="object-contain"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
            <span className="text-xl font-bold text-gray-900">FORMA Atlas</span>
          </Link>
          <div className="flex space-x-6">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${
                currentPath === '/' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className={`font-medium transition-colors ${
                currentPath === '/browse' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Browse Data
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors ${
                currentPath === '/about' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

