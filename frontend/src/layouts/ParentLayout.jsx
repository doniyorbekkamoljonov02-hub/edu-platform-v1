import DashboardShell from '../components/layout/DashboardShell'
import { parentNav } from '../constants/navigation'

function ParentLayout() {
  return <DashboardShell navItems={parentNav} />
}

export default ParentLayout
