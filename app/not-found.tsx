import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Image 
          src="/logo.png" 
          alt="FORMA Atlas Logo" 
          width={100} 
          height={100}
          className="object-contain mx-auto mb-4 opacity-50"
          style={{ backgroundColor: 'transparent' }}
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

