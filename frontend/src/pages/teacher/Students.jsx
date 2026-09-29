  import PageHeader from '../../components/ui/PageHeader'
  import TeacherStudentsList from '../../components/teacher/TeacherStudentsList'
  import Loader from '../../components/ui/Loader'
  import EmptyState from '../../components/ui/EmptyState'
  import { useCurrentTeacher } from '../../hooks/useCurrentTeacher'

  function Students() {
    const { teacher, isLoading } = useCurrentTeacher()

    return (
      <div>
        <PageHeader title="O‘quvchilar" description="Sizga biriktirilgan guruhlardagi o‘quvchilar." />
        {isLoading && <Loader />}
        {!isLoading && !teacher && (
          <EmptyState message="Hisobingiz hali biror o‘qituvchi profiliga biriktirilmagan." />
        )}
        {!isLoading && teacher && <TeacherStudentsList />}
      </div>
    )
  }

  export default Students
