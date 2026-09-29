import ResourceListPage from '../../components/common/ResourceListPage'
import { userService } from '../../services/user.service'
import { ROLE_LABELS } from '../../constants/roleLabels'

const columns = [
  { key: 'email', label: 'Email' },
  {
    key: 'fullName',
    label: 'F.I.Sh.',
    render: (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim(),
  },
  { key: 'role', label: 'Rol', render: (row) => ROLE_LABELS[row.role] ?? row.role },
  {
    key: 'isActive',
    label: 'Holati',
    render: (row) => (row.isActive ? 'Faol' : 'Bloklangan'),
  },
]

function Accounts() {
  return (
    <ResourceListPage
      title="Hisoblar"
      description="Tizimdagi barcha foydalanuvchi hisoblari."
      service={userService}
      columns={columns}
      emptyMessage="Hali hisoblar mavjud emas."
    />
  )
}

export default Accounts
