import { useEffect, useState } from 'react'
import { studentService } from '../services/student.service'

export function useCurrentStudent() {
  const [student, setStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    studentService.getMe()
      .then((data) => active && setStudent(data))
      .catch((err) => active && setError(err))
      .finally(() => active && setIsLoading(false))
    return () => { active = false }
  }, [])

  return { student, isLoading, error }
}
