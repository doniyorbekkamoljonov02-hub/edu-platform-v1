import PageHeader from '../../components/ui/PageHeader'
import MySchedule from '../../components/common/MySchedule'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { useCurrentChild } from '../../hooks/useCurrentChild'

function Schedule() {
  const { child, isLoading } = useCurrentChild()

  return (
    <div>
      <PageHeader title="Dars jadvali" description="Farzandingiz guruhining dars jadvali." />
      {isLoading && <Loader />}
      {!isLoading && !child && (
        <EmptyState message="Hisobingizga hali farzand biriktirilmagan." />
      )}
      {!isLoading && child && <MySchedule filterBy={{ groupId: child.groupId }} />}
    </div>
  )
}

export default Schedule
