import PageHeader from '../../components/ui/PageHeader'
import AttendanceList from '../../components/common/AttendanceList'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { useCurrentChild } from '../../hooks/useCurrentChild'

function Attendance() {
  const { child, isLoading } = useCurrentChild()

  return (
    <div>
      <PageHeader title="Davomat" description="Farzandingizning davomat tarixi." />
      {isLoading && <Loader />}
      {!isLoading && !child && (
        <EmptyState message="Hisobingizga hali farzand biriktirilmagan." />
      )}
      {!isLoading && child && <AttendanceList filterBy={{ studentId: child.id }} />}
    </div>
  )
}

export default Attendance
