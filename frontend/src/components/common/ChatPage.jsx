import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, CheckCheck, Image as ImageIcon, MessageCircle, Plus, Search, Send, Trash2, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { chatEventsUrl, chatService } from '../../services/chat.service'

const apiRoot = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
const fileUrl = (url) => url?.startsWith('http') ? url : `${apiRoot}${url || ''}`

export default function ChatPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  // /auth/me returns userId; use id as a compatibility fallback.
  const currentUserId = user?.userId ?? user?.id
  const [preview, setPreview] = useState(null)
  const [conversations, setConversations] = useState([])
  const [contacts, setContacts] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [newChat, setNewChat] = useState(false)
  const [busy, setBusy] = useState(true)
  const fileRef = useRef()
  const bottomRef = useRef()

  const loadConversations = async () => setConversations(await chatService.conversations())
  const loadMessages = async (conversationId) => {
    const list = await chatService.messages(conversationId)
    setMessages(list)
    loadConversations()
  }

  useEffect(() => {
    Promise.all([chatService.conversations(), chatService.contacts()])
      .then(([c, u]) => { setConversations(c); setContacts(u) })
      .finally(() => setBusy(false))
  }, [])

  useEffect(() => {
    if (!active?.id) return undefined
    let cancelled = false
    const run = async () => {
      try {
        const list = await chatService.messages(active.id)
        if (!cancelled) setMessages(Array.isArray(list) ? list : [])
        if (!cancelled) await loadConversations()
      } catch (error) {
        console.error('Chat xabarlarini yuklashda xatolik:', error)
      }
    }
    run()
    return () => { cancelled = true }
  }, [active?.id])

  useEffect(() => {
    if (!user) return
    const es = new EventSource(chatEventsUrl())
    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === 'message' && payload.message) {
          if (payload.message.conversationId === active?.id) {
            setMessages((current) => current.some((m) => m.id === payload.message.id) ? current : [...current, payload.message])
            if (String(payload.message.senderId) !== String(currentUserId)) {
              tone(760, 'receive')
              setTimeout(() => { loadMessages(active.id).catch((error) => console.error('Chat refresh xatosi:', error)) }, 80)
            }
          }
          loadConversations().catch((error) => console.error('Suhbatlarni yangilash xatosi:', error))
        }
        if (payload.type === 'deleted') {
          if (payload.conversationId === active?.id) setMessages((current) => current.filter((m) => m.id !== payload.messageId))
          loadConversations().catch((error) => console.error('Suhbatlarni yangilash xatosi:', error))
        }
        if (payload.type === 'read' && payload.conversationId === active?.id && String(payload.readerId) !== String(currentUserId)) {
          setMessages((current) => current.map((m) => String(m.senderId) === String(currentUserId) ? { ...m, isRead: true } : m))
        }
      } catch (error) {
        console.error('Realtime chat event xatosi:', error)
      }
    }
    return () => es.close()
  }, [user, currentUserId, active?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filtered = useMemo(() => conversations.filter((conversation) => {
    const person = conversation.people?.[0]
    return name(person).toLowerCase().includes(search.toLowerCase())
  }), [conversations, search])

  async function send(payload = {}) {
    if (!active || (!text.trim() && !payload.attachmentUrl)) return
    const value = text
    const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const optimistic = {
      id: tempId, conversationId: active.id, senderId: currentUserId,
      text: value.trim() || null, attachmentUrl: payload.attachmentUrl || null,
      attachmentType: payload.attachmentType || null, isRead: false,
      createdAt: new Date().toISOString(), pending: true,
    }
    // Render immediately. Network confirmation replaces this temporary message.
    setText('')
    setMessages((current) => [...current, optimistic])
    tone(430, 'send')
    try {
      const message = await chatService.send(active.id, { text: value, ...payload })
      setMessages((current) => current.map((m) => m.id === tempId ? message : m).filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i))
      loadConversations().catch(() => {})
    } catch {
      setMessages((current) => current.filter((m) => m.id !== tempId))
      setText(value)
    }
  }

  async function upload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const uploaded = await chatService.upload(file)
    await send({ attachmentUrl: uploaded.url, attachmentType: uploaded.type })
    event.target.value = ''
  }

  async function openContact(contact) {
    const conversation = await chatService.createConversation(contact.id)
    const all = await chatService.conversations()
    setConversations(all)
    setActive(all.find((item) => item.id === conversation.id) || { id: conversation.id, people: [contact] })
    setNewChat(false)
  }

  async function remove(id) {
    await chatService.remove(id)
    setMessages((current) => current.filter((m) => m.id !== id))
  }

  const person = active?.people?.[0]

  const home = `/${String(user?.role || 'student').toLowerCase()}/dashboard`
  const goBack = () => window.history.length > 1 ? navigate(-1) : navigate(home)

  return <div className="h-[100dvh] overflow-hidden bg-white">
    <div className="mx-auto flex h-full max-w-6xl overflow-hidden border-x border-[#E7E9EF]">
      <aside className={`${active ? 'hidden md:flex' : 'flex'} w-full flex-col border-r border-[#E7E9EF] bg-white md:w-[340px]`}>
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2"><button onClick={goBack} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:-translate-x-0.5 hover:bg-slate-50" aria-label="Ortga"><ArrowLeft size={18}/></button><span className="text-xs font-extrabold text-slate-600">Ortga</span></div>
          <div className="flex items-center justify-between"><div><h1 className="text-xl font-black text-[#111827]">Xabarlar</h1><p className="text-xs text-[#8A91A3]">Barcha suhbatlaringiz</p></div><button onClick={() => setNewChat(true)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#173B57] text-white"><Plus size={19}/></button></div>
          <div className="relative mt-4"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A2A6B7]"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Suhbatni qidirish..." className="w-full rounded-2xl bg-[#F4F6F8] py-3 pl-9 pr-3 text-sm outline-none"/></div>
        </div>
        <div className="flex-1 overflow-y-auto px-2">{busy ? <p className="p-4 text-xs text-[#9296A9]">Yuklanmoqda...</p> : filtered.length ? filtered.map((conversation) => <button key={conversation.id} onClick={() => setActive(conversation)} className="mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-[#F4F6F8]"><Avatar p={conversation.people?.[0]}/><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className={`min-w-0 flex-1 truncate text-sm ${conversation.unreadCount ? 'font-black text-[#0F172A]' : 'font-bold'}`}>{name(conversation.people?.[0])}</p>{conversation.unreadCount > 0 && <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#F43F5E] px-1.5 text-[10px] font-black text-white shadow-sm">{conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}</span>}</div><p className={`mt-1 truncate text-xs ${conversation.unreadCount ? 'font-bold text-[#475569]' : 'text-[#969AAC]'}`}>{conversation.lastMessage?.text || (conversation.lastMessage?.attachmentUrl ? 'Rasm' : 'Yangi suhbat')}</p></div></button>) : <Empty/>}</div>
      </aside>

      <section className={`${active ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col bg-[#EEF2F5]`}>
        {active ? <>
          <header className="flex h-16 items-center gap-3 border-b border-[#E7E9EF] bg-white px-3 sm:px-4"><button onClick={() => setActive(null)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"><ArrowLeft size={20}/></button><Avatar p={person}/><div><p className="text-sm font-bold">{name(person)}</p><p className="text-[10px] text-[#9296A9]">{roleLabel(person?.role)}</p></div></header>
          <div className="flex-1 overflow-y-auto p-3 sm:p-5"><div className="mx-auto max-w-2xl space-y-2.5">{messages.map((message) => {
            const mine = String(message.senderId) === String(currentUserId)
            return <div key={message.id} className={`group flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[84%] rounded-[20px] px-3.5 py-2.5 text-sm shadow-sm ${mine ? 'rounded-br-[6px] bg-[#173B57] text-white' : 'rounded-bl-[6px] border border-[#E5E7EB] bg-white text-[#202635]'}`}>
                {message.attachmentUrl && <button type="button" onClick={() => setPreview(fileUrl(message.attachmentUrl))} className="mb-2 block overflow-hidden rounded-2xl"><img src={fileUrl(message.attachmentUrl)} alt="Chat rasmi" className="max-h-64 w-full object-cover transition hover:scale-[1.02]"/></button>}
                {message.text && <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>}
                <div className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${mine ? 'text-white/60' : 'text-[#9AA0AE]'}`}><span>{new Date(message.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>{mine && (message.pending ? <span className="opacity-70">•••</span> : message.isRead ? <CheckCheck size={13} strokeWidth={2.4}/> : <Check size={13} strokeWidth={2.4}/>)}</div>
                {mine && <button onClick={() => remove(message.id)} className="absolute -left-9 top-1/2 hidden -translate-y-1/2 rounded-lg bg-white p-2 text-red-500 shadow group-hover:block"><Trash2 size={14}/></button>}
              </div>
            </div>
          })}<div ref={bottomRef}/></div></div>
          <div className="border-t border-[#E7E9EF] bg-white p-3"><div className="mx-auto flex max-w-2xl items-end gap-2"><input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden"/><button onClick={() => fileRef.current?.click()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4F6] text-[#173B57]"><ImageIcon size={19}/></button><textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1} placeholder="Xabar yozing..." className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl bg-[#F4F6F8] px-4 py-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#173B57]/15"/><button onClick={() => send()} disabled={!text.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#173B57] text-white disabled:opacity-40"><Send size={18}/></button></div></div>
        </> : <div className="m-auto text-center"><MessageCircle size={34} className="mx-auto text-[#173B57]"/><p className="mt-3 text-sm font-bold">Suhbatni tanlang</p><p className="mt-1 text-xs text-[#9296A9]">Xabarlar shu yerda ko‘rinadi.</p></div>}
      </section>
    </div>

    {preview && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#020617]/92 p-3 sm:p-8" onClick={() => setPreview(null)}><button type="button" aria-label="Yopish" onClick={() => setPreview(null)} className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white shadow-xl backdrop-blur-xl transition hover:scale-105 hover:bg-white/25 sm:right-7 sm:top-7"><X size={25} strokeWidth={2.5}/></button><img onClick={(e) => e.stopPropagation()} src={preview} alt="Kattalashtirilgan rasm" className="max-h-[88dvh] max-w-[96vw] rounded-2xl object-contain shadow-2xl"/></div>}
    {newChat && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 sm:items-center sm:p-4" onMouseDown={() => setNewChat(false)}><div onMouseDown={(e) => e.stopPropagation()} className="max-h-[72dvh] w-full max-w-md overflow-hidden rounded-t-[28px] bg-white p-4 sm:rounded-[28px]"><div className="mb-3 flex items-center justify-between"><h2 className="font-black">Yangi suhbat</h2><button onClick={() => setNewChat(false)} className="p-2"><X size={18}/></button></div><div className="max-h-[58dvh] overflow-y-auto">{contacts.map((contact) => <button key={contact.id} onClick={() => openContact(contact)} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-[#F4F6F8]"><Avatar p={contact}/><div><p className="text-sm font-bold">{name(contact)}</p><p className="text-xs text-[#9296A9]">{roleLabel(contact.role)}</p></div></button>)}</div></div></div>}
  </div>
}

function name(person) { return `${person?.firstName || ''} ${person?.lastName || ''}`.trim() || 'Foydalanuvchi' }
function roleLabel(role) { return ({ TEACHER: 'O‘qituvchi', STUDENT: 'O‘quvchi', PARENT: 'Ota-ona', ADMIN: 'Admin', DIRECTOR: 'Direktor' })[role] || role }
function Avatar({ p }) { const src=p?.avatarUrl?fileUrl(p.avatarUrl):''; return <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#E7F0F2] text-xs font-black text-[#173B57]">{src?<img src={src} alt="" className="h-full w-full object-cover"/>:`${p?.firstName?.[0] || 'U'}${p?.lastName?.[0] || ''}`}</div> }
function Empty() { return <div className="px-5 py-12 text-center"><MessageCircle size={28} className="mx-auto text-[#B6B9C8]"/><p className="mt-3 text-sm font-bold">Hali chat yo‘q</p><p className="mt-1 text-xs text-[#9296A9]">+ tugmasi orqali suhbat boshlang.</p></div> }
function tone(freq, kind = 'send') { try { const context = new (window.AudioContext || window.webkitAudioContext)(); const now = context.currentTime; const gain = context.createGain(); gain.connect(context.destination); gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'receive' ? .075 : .045, now + .015); gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === 'receive' ? .24 : .12)); const first = context.createOscillator(); first.connect(gain); first.frequency.setValueAtTime(freq, now); first.type = kind === 'receive' ? 'sine' : 'triangle'; first.start(now); first.stop(now + (kind === 'receive' ? .13 : .12)); if (kind === 'receive') { const second = context.createOscillator(); second.connect(gain); second.frequency.setValueAtTime(freq + 170, now + .11); second.start(now + .11); second.stop(now + .24) } } catch {} }
