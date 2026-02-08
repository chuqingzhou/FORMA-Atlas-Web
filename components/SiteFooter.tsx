'use client'

import VisitCounter from './VisitCounter'

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-3 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <VisitCounter />
      </div>
    </footer>
  )
}
