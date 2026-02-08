'use client'

import { useState, useEffect } from 'react'

export default function VisitCounter() {
  const [totalVisits, setTotalVisits] = useState<number | null>(null)

  useEffect(() => {
    const recordAndFetch = async () => {
      try {
        await fetch('/api/record-visit', { method: 'POST' })
        const res = await fetch('/api/site-stats')
        const data = await res.json()
        setTotalVisits(data.total_visits ?? 0)
      } catch {
        setTotalVisits(0)
      }
    }

    recordAndFetch()
  }, [])

  if (totalVisits === null) return null

  return (
    <span className="text-gray-500 text-sm">
      Total visits: {totalVisits.toLocaleString()}
    </span>
  )
}
