import PageHeader from '../../components/ui/PageHeader'
import GradesList from '../../components/common/GradesList'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { useCurrentChild } from '../../hooks/useCurrentChild'

function Grades() {
  const { child, isLoading } = useCurrentChild()

  return (
    <div>
      <PageHeader title="Baholar" description="Farzandingizning barcha fanlar bo‘yicha baholari." />
      {isLoading && <Loader />}
      {!isLoading && !child && (
        <EmptyState message="Hisobingizga hali farzand biriktirilmagan." />
      )}
      {!isLoading && child && <GradesList filterBy={{ studentId: child.id }} />}
    </div>
  )
}

export default Grades
