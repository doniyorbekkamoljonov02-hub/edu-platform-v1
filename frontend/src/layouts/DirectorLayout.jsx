import DashboardShell from '../components/layout/DashboardShell'
import { directorNav } from '../constants/navigation'

function DirectorLayout() {
  return <DashboardShell navItems={directorNav} />
}

export default DirectorLayout
