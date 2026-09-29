import { useEffect, useState } from 'react'
import { parentService } from '../services/parent.service'

export function useCurrentParent() {
  const [parent, setParent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    parentService.getMe()
      .then((data) => active && setParent(data))
      .catch((err) => active && setError(err))
      .finally(() => active && setIsLoading(false))
    return () => { active = false }
  }, [])

  return { parent, isLoading, error }
}
