import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { chatEventsUrl, chatService } from '../services/chat.service'
import { useAuth } from '../context/AuthContext'

export function useUnreadChat() {
  const { user } = useAuth()
  const location = useLocation()
  const [total, setTotal] = useState(0)

  const refresh = useCallback(async () => {
    if (!user) return
    try {
      const conversations = await chatService.conversations()
      setTotal((conversations || []).reduce((sum, item) => sum + Number(item.unreadCount || 0), 0))
    } catch (error) {
      console.error('O‘qilmagan xabarlarni olishda xatolik:', error)
    }
  }, [user])

  useEffect(() => { refresh() }, [refresh, location.pathname])

  useEffect(() => {
    if (!user) return undefined
    const es = new EventSource(chatEventsUrl())
    es.onmessage = () => { window.setTimeout(refresh, 80) }
    return () => es.close()
  }, [user, refresh])

  return { unreadCount: total, refreshUnread: refresh }
}
