import DashboardShell from '../components/layout/DashboardShell'
import { teacherNav } from '../constants/navigation'

function TeacherLayout() {
  return <DashboardShell navItems={teacherNav} />
}

export default TeacherLayout
