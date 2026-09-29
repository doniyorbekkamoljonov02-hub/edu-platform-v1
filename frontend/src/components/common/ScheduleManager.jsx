import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { scheduleService } from '../../services/schedule.service'
import { teacherService } from '../../services/teacher.service'
import { subjectService } from '../../services/subject.service'
import { groupService } from '../../services/group.service'
import { DAY_LABELS, DAY_ORDER } from '../../constants/dayOfWeek'
import PageHeader from '../ui/PageHeader'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import FormField, { inputClass } from '../ui/FormField'

const EMPTY_FORM = {
  teacherId: '',
  groupId: '',
  dayOfWeek: 'MONDAY',
  startTime: '09:00',
  endTime: '10:20',
  room: '',
  isActive: true,
}

/**
 * The "Dars jadvali" page: lists every lesson (teacher/subject/group/day/
 * time/room, joined for display) and lets ADMIN/DIRECTOR add, edit and
 * delete lessons against the real backend. Subject is derived from the
 * chosen teacher, since each teacher teaches exactly one subject.
 */
function ScheduleManager() {
  const schedule = useFetch(() => scheduleService.getAll(), [])
  const teachers = useFetch(() => teacherService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])
  const groups = useFetch(() => groupService.getAll(), [])

  const isLoading =
    schedule.isLoading || teachers.isLoading || subjects.isLoading || groups.isLoading
  const error = schedule.error || teachers.error || subjects.error || groups.error

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const teachersById = useMemo(
    () => new Map((teachers.data ?? []).map((t) => [t.id, t])),
    [teachers.data],
  )
  const subjectsById = useMemo(
    () => new Map((subjects.data ?? []).map((s) => [s.id, s])),
    [subjects.data],
  )
  const groupsById = useMemo(
    () => new Map((groups.data ?? []).map((g) => [g.id, g])),
    [groups.data],
  )

  const rows = useMemo(() => {
    if (!schedule.data) return []
    return [...schedule.data]
      .sort((a, b) => {
        const dayDiff = DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
        return dayDiff !== 0 ? dayDiff : a.startTime.localeCompare(b.startTime)
      })
      .map((row) => ({
        ...row,
        day: DAY_LABELS[row.dayOfWeek] ?? row.dayOfWeek,
        time: `${row.startTime}–${row.endTime}`,
        groupName: groupsById.get(row.groupId)?.name ?? '—',
        subjectName: subjectsById.get(row.subjectId)?.name ?? '—',
        teacherName: (() => {
          const t = teachersById.get(row.teacherId)
          return t ? `${t.firstName} ${t.lastName}` : '—'
        })(),
      }))
  }, [schedule.data, teachersById, subjectsById, groupsById])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setForm({
      teacherId: row.teacherId,
      groupId: row.groupId,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      room: row.room ?? '',
      isActive: row.isActive,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError('')
    try {
      const teacher = teachersById.get(form.teacherId)
      if (!teacher) {
        setFormError('O‘qituvchini tanlang.')
        setIsSubmitting(false)
        return
      }
      const payload = { ...form, subjectId: teacher.subjectId }

      if (editingId) {
        await scheduleService.update(editingId, payload)
      } else {
        await scheduleService.create(payload)
      }
      setIsModalOpen(false)
      schedule.refetch()
    } catch (err) {
      const message = err?.response?.data?.message || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.'
      setFormError(Array.isArray(message) ? message[0] : message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(row) {
    if (!window.confirm('Bu darsni jadvaldan o‘chirishni tasdiqlaysizmi?')) return
    await scheduleService.remove(row.id)
    schedule.refetch()
  }

  const columns = [
    { key: 'day', label: 'Hafta kuni' },
    { key: 'time', label: 'Vaqt' },
    { key: 'groupName', label: 'Guruh' },
    { key: 'subjectName', label: 'Fan' },
    { key: 'teacherName', label: 'O‘qituvchi' },
    { key: 'room', label: 'Xona' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Tahrirlash"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="O‘chirish"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  const selectedTeacherSubject = form.teacherId
    ? subjectsById.get(teachersById.get(form.teacherId)?.subjectId)?.name
    : null

  return (
    <div>
      <PageHeader
        title="Dars jadvali"
        description="Barcha darslar — kun, vaqt, guruh, fan va o‘qituvchi bo‘yicha."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Dars qo‘shish
          </Button>
        }
      />

      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState />}
      {!isLoading && !error && rows.length === 0 && (
        <EmptyState message="Hali dars jadvali tuzilmagan." />
      )}
      {!isLoading && !error && rows.length > 0 && <Table columns={columns} rows={rows} />}

      <Modal
        title={editingId ? 'Darsni tahrirlash' : 'Dars qo‘shish'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="O‘qituvchi">
            <select
              required
              className={inputClass}
              value={form.teacherId}
              onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value }))}
            >
              <option value="" disabled>
                Tanlang
              </option>
              {(teachers.data ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Fan">
            <input
              disabled
              className={`${inputClass} bg-gray-50 text-gray-500`}
              value={selectedTeacherSubject ?? 'O‘qituvchini tanlang'}
              readOnly
            />
          </FormField>

          <FormField label="Guruh">
            <select
              required
              className={inputClass}
              value={form.groupId}
              onChange={(e) => setForm((f) => ({ ...f, groupId: e.target.value }))}
            >
              <option value="" disabled>
                Tanlang
              </option>
              {(groups.data ?? []).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Hafta kuni">
            <select
              className={inputClass}
              value={form.dayOfWeek}
              onChange={(e) => setForm((f) => ({ ...f, dayOfWeek: e.target.value }))}
            >
              {DAY_ORDER.map((day) => (
                <option key={day} value={day}>
                  {DAY_LABELS[day]}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Boshlanish vaqti">
              <input
                type="time"
                required
                className={inputClass}
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              />
            </FormField>
            <FormField label="Tugash vaqti">
              <input
                type="time"
                required
                className={inputClass}
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="Xona">
            <input
              className={inputClass}
              value={form.room}
              onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
              placeholder="204"
            />
          </FormField>

          <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            Faol
          </label>

          {formError && <p className="mb-4 text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ScheduleManager
