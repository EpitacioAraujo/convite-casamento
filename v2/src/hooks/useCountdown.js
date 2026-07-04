import { useState, useEffect } from 'react'

const WEDDING = new Date('Oct 21, 2026 16:30:00').getTime()

export default function useCountdown() {
  const [parts, setParts] = useState(calc())

  function calc() {
    const dist = WEDDING - Date.now()
    if (dist < 0) return null
    return {
      days: String(Math.floor(dist / 86400000)).padStart(2, '0'),
      hours: String(Math.floor((dist % 86400000) / 3600000)).padStart(2, '0'),
      minutes: String(Math.floor((dist % 3600000) / 60000)).padStart(2, '0'),
      seconds: String(Math.floor((dist % 60000) / 1000)).padStart(2, '0'),
    }
  }

  useEffect(() => {
    const id = setInterval(() => setParts(calc()), 1000)
    return () => clearInterval(id)
  }, [])

  return parts
}
