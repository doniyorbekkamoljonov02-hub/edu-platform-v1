import SimpleResourceManager from '../../components/common/SimpleResourceManager'
import { subjectService } from '../../services/subject.service'

function Subjects() {
  return (
    <SimpleResourceManager
      title="Fanlar"
      description="O‘quv markazida o‘qitiladigan fanlar ro‘yxati."
      service={subjectService}
      nameLabel="Fan nomi"
      emptyMessage="Hali fanlar qo‘shilmagan."
    />
  )
}

export default Subjects
