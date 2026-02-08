'use client'

import { useState, useEffect } from 'react'

export default function VisitCounter() {
  const [totalVisits, setTotalVisits] = useState<number | null>(null)

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const res = await fetch('/api/record-visit', {
          method: 'POST',
          cache: 'no-store'
        })
        const data = await res.json()
        const count = Number(data?.total_visits ?? 0)
        setTotalVisits(count)
      } catch {
        setTotalVisits(0)
      }
    }

    recordVisit()
  }, [])

  if (totalVisits === null) return null

  return (
    <span className="text-gray-500 text-sm">
      Total visits: {totalVisits.toLocaleString()}
    </span>
  )
}
