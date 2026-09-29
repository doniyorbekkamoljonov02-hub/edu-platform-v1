import PageHeader from '../../components/ui/PageHeader'
import MySchedule from '../../components/common/MySchedule'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher'

function Schedule() {
  const { teacher, isLoading } = useCurrentTeacher()

  return (
    <div>
      <PageHeader title="Dars jadvalim" description="Haftalik dars jadvalingiz." />
      {isLoading && <Loader />}
      {!isLoading && !teacher && (
        <EmptyState message="Hisobingiz hali biror o‘qituvchi profiliga biriktirilmagan." />
      )}
      {!isLoading && teacher && <MySchedule filterBy={{ teacherId: teacher.id }} />}
    </div>
  )
}

export default Schedule
