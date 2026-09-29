import { useCallback, useEffect, useState } from 'react'

/**
 * Fetches data from a real service call on mount and exposes
 * { data, isLoading, error, refetch }. No mock/fallback data is ever
 * returned — callers render their own loading/empty/error states.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const run = useCallback(() => {
    setIsLoading(true)
    setError(null)
    return fetcher()
      .then((result) => setData(result))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
  }, [run])

  return { data, isLoading, error, refetch: run }
}
