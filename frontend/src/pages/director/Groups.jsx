import SimpleResourceManager from '../../components/common/SimpleResourceManager'
import { groupService } from '../../services/group.service'

function Groups() {
  return (
    <SimpleResourceManager
      title="Guruhlar"
      description="O‘quv markazidagi barcha guruhlar ro‘yxati."
      service={groupService}
      nameLabel="Guruh nomi"
      emptyMessage="Hali guruhlar qo‘shilmagan."
    />
  )
}

export default Groups
