import { useEffect, useState } from 'react'
import { parentService } from '../services/parent.service'

export function useCurrentChild() {
  const [child, setChild] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    parentService.getMyChild()
      .then((data) => active && setChild(data))
      .catch((err) => active && setError(err))
      .finally(() => active && setIsLoading(false))
    return () => { active = false }
  }, [])

  return { child, isLoading, error }
}
