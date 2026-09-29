import { useEffect, useState } from 'react'
import { teacherService } from '../services/teacher.service'

export function useCurrentTeacher() {
  const [teacher, setTeacher] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadTeacher = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await teacherService.getMe()

        if (isMounted) {
          setTeacher(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadTeacher()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    teacher,
    isLoading,
    error,
  }
}