import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'
import { chatEventsUrl } from '../../services/chat.service'
import { useAuth } from '../../context/AuthContext'

function ping() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const gain = ctx.createGain(); gain.connect(ctx.destination)
    const now = ctx.currentTime
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.075, now + .015); gain.gain.exponentialRampToValueAtTime(.0001, now + .28)
    ;[720, 920].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator(); oscillator.connect(gain); oscillator.frequency.value = frequency
      const at = now + index * .12; oscillator.start(at); oscillator.stop(at + .13)
    })
  } catch {}
}

const chatPath = (role) => ({ STUDENT:'/student/chat', TEACHER:'/teacher/chat', PARENT:'/parent/chat', ADMIN:'/admin/chat', DIRECTOR:'/director/chat' })[role]

export default function RealtimeMessageToast() {
  const { user } = useAuth(); const location = useLocation(); const navigate = useNavigate(); const currentUserId = user?.userId ?? user?.id
  const [toast, setToast] = useState(null); const timer = useRef(null)
  useEffect(() => {
    const target = chatPath(user?.role)
    if (!user || !target) return
    const es = new EventSource(chatEventsUrl())
    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type !== 'message' || !payload.message || String(payload.message.senderId) === String(currentUserId) || location.pathname === target) return
        setToast(payload.message); ping(); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 5000)
      } catch (error) {
        console.error('Realtime notification xatosi:', error)
      }
    }
    return () => { es.close(); clearTimeout(timer.current) }
  }, [user, currentUserId, location.pathname])
  if (!toast) return null
  const target = chatPath(user?.role)
  const name = `${toast.sender?.firstName || ''} ${toast.sender?.lastName || ''}`.trim() || 'Yangi xabar'
  return <div className="fixed left-3 right-3 top-3 z-[100] mx-auto max-w-md animate-[slideDown_.22s_ease-out] rounded-2xl border border-[#E3E7EC] bg-white p-3 shadow-2xl">
    <button onClick={() => { setToast(null); navigate(target) }} className="flex w-full items-center gap-3 text-left">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7F0F2] text-[#173B57]"><MessageCircle size={19}/></div>
      <div className="min-w-0 flex-1"><p className="text-sm font-bold text-[#202635]">{name}</p><p className="mt-0.5 truncate text-xs text-[#7B8491]">{toast.text || 'Rasm yubordi'}</p></div>
      <span onClick={(e) => { e.stopPropagation(); setToast(null) }} className="p-2 text-[#9AA2AE]"><X size={17}/></span>
    </button>
  </div>
}
