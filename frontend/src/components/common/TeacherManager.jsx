import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Lock, Unlock } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { teacherService } from '../../services/teacher.service'
import { userService } from '../../services/user.service'
import { subjectService } from '../../services/subject.service'
import { ROLES } from '../../constants/roles'
import PageHeader from '../ui/PageHeader'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import FormField, { inputClass } from '../ui/FormField'

const EMPTY_CREATE_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subjectId: '',
  password: '',
  isActive: true,
}

const EMPTY_EDIT_FORM = { firstName: '', lastName: '', phone: '', subjectId: '' }

/**
 * The "O'qituvchilar" page for ADMIN/DIRECTOR. Creating a teacher is a
 * two-step real flow: POST /users (account + password) then POST /teachers
 * (subject + name linked to that account) — both against the real backend.
 */
function TeacherManager() {
  const teachers = useFetch(() => teacherService.getAll(), [])
  const users = useFetch(() => userService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])

  const isLoading = teachers.isLoading || users.isLoading || subjects.isLoading
  const error = teachers.error || users.error || subjects.error

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [editingRow, setEditingRow] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM)

  const usersById = useMemo(
    () => new Map((users.data ?? []).map((u) => [u.id, u])),
    [users.data],
  )
  const subjectsById = useMemo(
    () => new Map((subjects.data ?? []).map((s) => [s.id, s])),
    [subjects.data],
  )

  const rows = useMemo(() => {
    if (!teachers.data) return []
    return teachers.data.map((t) => {
      const account = usersById.get(t.userId)
      return {
        id: t.id,
        userId: t.userId,
        subjectId: t.subjectId,
        firstName: t.firstName,
        lastName: t.lastName,
        phone: t.phone,
        fullName: `${t.firstName} ${t.lastName}`,
        subjectName: subjectsById.get(t.subjectId)?.name ?? '—',
        email: account?.email ?? '—',
        isActive: account?.isActive ?? false,
      }
    })
  }, [teachers.data, usersById, subjectsById])

  function refetchAll() {
    teachers.refetch()
    users.refetch()
  }

  async function handleCreateSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError('')
    try {
      const account = await userService.create({
        email: createForm.email,
        password: createForm.password,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        phone: createForm.phone,
        role: ROLES.TEACHER,
        isActive: createForm.isActive,
      })
      await teacherService.create({
        userId: account.id,
        subjectId: createForm.subjectId,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        phone: createForm.phone,
      })
      setIsCreateOpen(false)
      setCreateForm(EMPTY_CREATE_FORM)
      refetchAll()
    } catch (err) {
      const message = err?.response?.data?.message || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.'
      setFormError(Array.isArray(message) ? message[0] : message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function openEdit(row) {
    setEditingRow(row)
    setEditForm({
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone ?? '',
      subjectId: row.subjectId,
    })
    setFormError('')
  }

  async function handleEditSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError('')
    try {
      await teacherService.update(editingRow.id, editForm)
      setEditingRow(null)
      refetchAll()
    } catch (err) {
      const message = err?.response?.data?.message || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.'
      setFormError(Array.isArray(message) ? message[0] : message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleActive(row) {
    await userService.update(row.userId, { isActive: !row.isActive })
    refetchAll()
  }

  async function handleDelete(row) {
    if (!window.confirm(`"${row.fullName}"ni o‘qituvchilar ro‘yxatidan o‘chirishni tasdiqlaysizmi?`))
      return
    await teacherService.remove(row.id)
    refetchAll()
  }

  const columns = [
    { key: 'fullName', label: 'F.I.Sh.' },
    { key: 'subjectName', label: 'Fan' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telefon' },
    {
      key: 'isActive',
      label: 'Holati',
      render: (row) => (row.isActive ? 'Faol' : 'Bloklangan'),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => handleToggleActive(row)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label={row.isActive ? 'Bloklash' : 'Faollashtirish'}
            title={row.isActive ? 'Bloklash' : 'Faollashtirish'}
          >
            {row.isActive ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
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

  return (
    <div>
      <PageHeader
        title="O‘qituvchilar"
        description="Har bir o‘qituvchi va u o‘qitadigan fan."
        action={
          <Button
            onClick={() => {
              setCreateForm(EMPTY_CREATE_FORM)
              setFormError('')
              setIsCreateOpen(true)
            }}
          >
            <Plus size={16} />
            O‘qituvchi qo‘shish
          </Button>
        }
      />

      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState />}
      {!isLoading && !error && rows.length === 0 && (
        <EmptyState message="Hali o‘qituvchilar qo‘shilmagan." />
      )}
      {!isLoading && !error && rows.length > 0 && <Table columns={columns} rows={rows} />}

      <Modal title="O‘qituvchi qo‘shish" isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <form onSubmit={handleCreateSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ism">
              <input
                required
                className={inputClass}
                value={createForm.firstName}
                onChange={(e) => setCreateForm((f) => ({ ...f, firstName: e.target.value }))}
              />
            </FormField>
            <FormField label="Familiya">
              <input
                required
                className={inputClass}
                value={createForm.lastName}
                onChange={(e) => setCreateForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="Email">
            <input
              type="email"
              required
              className={inputClass}
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
          </FormField>

          <FormField label="Telefon">
            <input
              className={inputClass}
              value={createForm.phone}
              onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+998 90 123 45 67"
            />
          </FormField>

          <FormField label="Fan">
            <select
              required
              className={inputClass}
              value={createForm.subjectId}
              onChange={(e) => setCreateForm((f) => ({ ...f, subjectId: e.target.value }))}
            >
              <option value="" disabled>
                Tanlang
              </option>
              {(subjects.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Parol">
            <input
              type="password"
              required
              minLength={8}
              className={inputClass}
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Kamida 8 ta belgi"
            />
          </FormField>

          <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={createForm.isActive}
              onChange={(e) => setCreateForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            Hisob faol
          </label>

          {formError && <p className="mb-4 text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsCreateOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>

      <Modal title="O‘qituvchini tahrirlash" isOpen={!!editingRow} onClose={() => setEditingRow(null)}>
        <form onSubmit={handleEditSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ism">
              <input
                required
                className={inputClass}
                value={editForm.firstName}
                onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
              />
            </FormField>
            <FormField label="Familiya">
              <input
                required
                className={inputClass}
                value={editForm.lastName}
                onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="Telefon">
            <input
              className={inputClass}
              value={editForm.phone}
              onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </FormField>

          <FormField label="Fan">
            <select
              required
              className={inputClass}
              value={editForm.subjectId}
              onChange={(e) => setEditForm((f) => ({ ...f, subjectId: e.target.value }))}
            >
              {(subjects.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>

          <p className="mb-4 text-xs text-gray-400">
            Email va parolni o‘zgartirish hozircha mavjud emas.
          </p>

          {formError && <p className="mb-4 text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setEditingRow(null)}>
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

export default TeacherManager
