import { useMemo, useState } from 'react'
import { Megaphone, Plus, Pencil, Trash2, Users, CalendarDays } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { newsService } from '../../services/news.service'
import { groupService } from '../../services/group.service'
import { teacherService } from '../../services/teacher.service'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../ui/PageHeader'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import FormField, { inputClass } from '../ui/FormField'

const EMPTY={title:'',content:'',targetGroupId:'',isPublished:true}
export default function NewsManager({ readOnly=false }){
 const {user}=useAuth(); const news=useFetch(()=>newsService.getAll(),[]); const groups=useFetch(()=>groupService.getAll(),[]); const myStudents=useFetch(()=>user?.role==='TEACHER'?teacherService.getMyStudents():Promise.resolve([]),[user?.role]);
 const [open,setOpen]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState(EMPTY),[busy,setBusy]=useState(false),[err,setErr]=useState('')
 const allowedGroups=useMemo(()=>{if(user?.role!=='TEACHER')return groups.data||[];const ids=new Set((myStudents.data||[]).map(s=>s.groupId));return (groups.data||[]).filter(g=>ids.has(g.id))},[groups.data,myStudents.data,user?.role])
 function create(){setEditing(null);setForm(EMPTY);setErr('');setOpen(true)} function edit(n){setEditing(n.id);setForm({title:n.title,content:n.content,targetGroupId:n.targetGroupId||'',isPublished:n.isPublished});setOpen(true)}
 async function submit(e){e.preventDefault();setBusy(true);setErr('');try{const payload={...form,targetGroupId:form.targetGroupId||undefined};editing?await newsService.update(editing,payload):await newsService.create(payload);setOpen(false);setForm(EMPTY);news.refetch()}catch(e){const m=e?.response?.data?.message||'Yangilikni saqlab bo‘lmadi.';setErr(Array.isArray(m)?m[0]:m)}finally{setBusy(false)}}
 async function remove(n){if(!confirm(`“${n.title}” o‘chirilsinmi?`))return;try{await newsService.remove(n.id);news.refetch()}catch(e){alert(e?.response?.data?.message||'O‘chirib bo‘lmadi.')}}
 return <div><PageHeader title="Yangiliklar" description="Maktab e’lonlari va sinflarga mo‘ljallangan postlar." action={!readOnly&&['TEACHER','ADMIN','DIRECTOR'].includes(user?.role)?<Button onClick={create}><Plus size={16}/>Post yozish</Button>:null}/>
 {(news.isLoading||groups.isLoading)&&<Loader/>}{news.error&&<ErrorState/>}{!news.isLoading&&!news.error&&!(news.data||[]).length&&<EmptyState message="Hali yangiliklar yo‘q."/>}
 <div className="grid gap-4 lg:grid-cols-2">{(news.data||[]).map(n=><article key={n.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700"><Megaphone size={20}/></div><div><h3 className="font-bold text-slate-950">{n.title}</h3><p className="mt-1 text-xs text-slate-500">{n.authorName} · {n.authorRole}</p></div></div>{n.canManage&&!readOnly&&<div className="flex"><button onClick={()=>edit(n)} className="p-2 text-slate-400 hover:text-slate-900"><Pencil size={16}/></button><button onClick={()=>remove(n)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></div>}</div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{n.content}</p><div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-slate-600"><Users size={13}/>{n.targetGroupName}</span><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-slate-600"><CalendarDays size={13}/>{new Date(n.createdAt).toLocaleDateString('uz-UZ')}</span></div></article>)}</div>
 <Modal title={editing?'Postni tahrirlash':'Yangi post'} isOpen={open} onClose={()=>setOpen(false)}><form onSubmit={submit}><FormField label="Sarlavha"><input required className={inputClass} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></FormField><FormField label="Yangilik matni"><textarea required rows={6} className={inputClass} value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></FormField><FormField label="Kimlar uchun?"><select className={inputClass} value={form.targetGroupId} onChange={e=>setForm({...form,targetGroupId:e.target.value})}><option value="">Barcha sinflar</option>{allowedGroups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></FormField><label className="mb-4 flex gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})}/>Darhol e’lon qilish</label>{err&&<p className="mb-3 text-sm text-red-600">{err}</p>}<Button type="submit" isLoading={busy} className="w-full">Postni saqlash</Button></form></Modal>
 </div>
}
