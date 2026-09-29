import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import PageHeader from '../ui/PageHeader'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import FormField, { inputClass } from '../ui/FormField'

const EMPTY_FORM = { name: '', description: '', isActive: true }

/**
 * Full CRUD manager for simple { name, description, isActive } resources
 * (Subjects, Groups). Every action hits the real backend — create/update/
 * delete all call the given service and refetch afterwards.
 */
function SimpleResourceManager({ title, description, service, emptyMessage, nameLabel = 'Nomi' }) {
  const { data, isLoading, error, refetch } = useFetch(() => service.getAll(), [service])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setForm({ name: row.name, description: row.description ?? '', isActive: row.isActive })
    setFormError('')
    setIsModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError('')
    try {
      if (editingId) {
        await service.update(editingId, form)
      } else {
        await service.create(form)
      }
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      const message = err?.response?.data?.message || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.'
      setFormError(Array.isArray(message) ? message[0] : message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`"${row.name}"ni o‘chirishni tasdiqlaysizmi?`)) return
    await service.remove(row.id)
    refetch()
  }

  const columns = [
    { key: 'name', label: nameLabel },
    { key: 'description', label: 'Tavsif' },
    {
      key: 'isActive',
      label: 'Holati',
      render: (row) => (row.isActive ? 'Faol' : 'Nofaol'),
    },
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

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Qo‘shish
          </Button>
        }
      />

      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState />}
      {!isLoading && !error && (!data || data.length === 0) && (
        <EmptyState message={emptyMessage} />
      )}
      {!isLoading && !error && data && data.length > 0 && (
        <Table columns={columns} rows={data} />
      )}

      <Modal
        title={editingId ? 'Tahrirlash' : 'Qo‘shish'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormField label={nameLabel}>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </FormField>

          <FormField label="Tavsif">
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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

export default SimpleResourceManager
