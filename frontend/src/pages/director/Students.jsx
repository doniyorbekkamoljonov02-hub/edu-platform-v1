import ResourceListPage from '../../components/common/ResourceListPage'
import { studentService } from '../../services/student.service'

const columns = [
  { key: 'groupId', label: 'Guruh ID' },
  { key: 'dateOfBirth', label: 'Tug‘ilgan sana' },
  { key: 'enrollmentDate', label: 'Qabul qilingan sana' },
]

function Students() {
  return (
    <ResourceListPage
      title="O‘quvchilar"
      description="O‘quv markazidagi barcha o‘quvchilar ro‘yxati."
      service={studentService}
      columns={columns}
      emptyMessage="Hali o‘quvchilar qo‘shilmagan."
    />
  )
}

export default Students
