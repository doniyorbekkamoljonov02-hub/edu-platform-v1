import DashboardShell from '../components/layout/DashboardShell'
import { adminNav } from '../constants/navigation'

function AdminLayout() {
  return <DashboardShell navItems={adminNav} />
}

export default AdminLayout
