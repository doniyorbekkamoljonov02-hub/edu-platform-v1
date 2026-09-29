import ResourceListPage from '../../components/common/ResourceListPage'
import { adminService } from '../../services/admin.service'

const columns = [
  { key: 'userId', label: 'Foydalanuvchi ID' },
  { key: 'createdAt', label: 'Qo‘shilgan sana' },
]

function Admins() {
  return (
    <ResourceListPage
      title="Adminlar"
      description="Tizimdagi administratorlar ro‘yxati."
      service={adminService}
      columns={columns}
      emptyMessage="Hali adminlar qo‘shilmagan."
    />
  )
}

export default Admins
