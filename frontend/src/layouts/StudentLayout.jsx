import DashboardShell from '../components/layout/DashboardShell'
import { studentNav } from '../constants/navigation'

function StudentLayout() {
  return (
    <DashboardShell
      navItems={studentNav}
      variant="student"
    />
  )
}

export default StudentLayout