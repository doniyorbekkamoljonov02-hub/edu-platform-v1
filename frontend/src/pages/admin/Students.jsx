import { useState } from 'react'
import { Plus, Search, UserPlus } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { studentService } from '../../services/student.service'
import { groupService } from '../../services/group.service'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import FormField, { inputClass } from '../../components/ui/FormField'
import Loader from '../../components/ui/Loader'
import ErrorState from '../../components/ui/ErrorState'

const EMPTY = { firstName:'', lastName:'', email:'', password:'', phone:'', groupId:'', dateOfBirth:'' }
export default function Students() {
  const students = useFetch(() => studentService.getAll(), [])
  const groups = useFetch(() => groupService.getAll(), [])
  const [open,setOpen]=useState(false), [form,setForm]=useState(EMPTY), [busy,setBusy]=useState(false), [err,setErr]=useState(''), [q,setQ]=useState('')
  const list=(students.data||[]).filter(s=>`${s.firstName} ${s.lastName} ${s.email} ${s.groupName}`.toLowerCase().includes(q.toLowerCase()))
  async function submit(e){e.preventDefault();setBusy(true);setErr('');try{await studentService.createWithAccount(form);setForm(EMPTY);setOpen(false);students.refetch()}catch(e){const m=e?.response?.data?.message||'O‘quvchini qo‘shib bo‘lmadi.';setErr(Array.isArray(m)?m[0]:m)}finally{setBusy(false)}}
  return <div><PageHeader title="O‘quvchilar" description="O‘quvchi hisobini yarating va sinfga biriktiring." action={<Button onClick={()=>setOpen(true)}><Plus size={16}/>O‘quvchi qo‘shish</Button>}/>
    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4"><Search size={18} className="text-slate-400"/><input className="h-12 flex-1 outline-none" placeholder="Ism, email yoki sinf bo‘yicha qidirish" value={q} onChange={e=>setQ(e.target.value)}/></div>
    {(students.isLoading||groups.isLoading)&&<Loader/>}{(students.error||groups.error)&&<ErrorState/>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map(s=><div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><UserPlus size={19}/></div><div><p className="font-semibold text-slate-900">{s.firstName} {s.lastName}</p><p className="text-xs text-slate-500">{s.email}</p></div></div><div className="mt-4 flex justify-between text-sm"><span className="text-slate-500">Sinf</span><b>{s.groupName||'—'}</b></div></div>)}</div>
    <Modal title="Yangi o‘quvchi" isOpen={open} onClose={()=>setOpen(false)}><form onSubmit={submit} className="space-y-1"><div className="grid gap-3 sm:grid-cols-2"><FormField label="Ism"><input required className={inputClass} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/></FormField><FormField label="Familiya"><input required className={inputClass} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})}/></FormField></div><FormField label="Email"><input required type="email" className={inputClass} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FormField><FormField label="Boshlang‘ich parol"><input required minLength={8} className={inputClass} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></FormField><FormField label="Telefon"><input className={inputClass} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></FormField><FormField label="Sinf"><select required className={inputClass} value={form.groupId} onChange={e=>setForm({...form,groupId:e.target.value})}><option value="">Sinfni tanlang</option>{(groups.data||[]).map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></FormField><FormField label="Tug‘ilgan sana"><input type="date" className={inputClass} value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/></FormField>{err&&<p className="text-sm text-red-600">{err}</p>}<Button type="submit" isLoading={busy} className="w-full">Saqlash</Button></form></Modal>
  </div>
}
