import { useEffect, useState } from 'react'
import type { PortfolioData } from '../types'

let cache: PortfolioData | null = null
let pending: Promise<PortfolioData> | null = null

export function loadPortfolio(): Promise<PortfolioData> {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = fetch('/data/portfolio.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load portfolio data (${r.status})`)
        return r.json() as Promise<PortfolioData>
      })
      .then((data) => {
        cache = data
        return data
      })
  }
  return pending
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(cache)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cache) return
    let alive = true
    loadPortfolio()
      .then((d) => alive && setData(d))
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [])

  return { data, error }
}
