import { User } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { useCurrentChild } from '../../hooks/useCurrentChild'

function ChildProfile() {
  const { child, isLoading } = useCurrentChild()

  return (
    <div>
      <PageHeader title="Farzandim" description="Farzandingiz haqidagi ma’lumotlar." />
      {isLoading && <Loader />}
      {!isLoading && !child && (
        <EmptyState message="Hisobingizga hali farzand biriktirilmagan." />
      )}
      {!isLoading && child && (
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User size={22} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{child.fullName}</p>
              <p className="text-sm text-gray-500">Tug‘ilgan sana: {child.dateOfBirth ?? '—'}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Qabul qilingan sana: {child.enrollmentDate ?? '—'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ChildProfile
