import PageHeader from '../../components/ui/PageHeader'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import TeacherActionWorkspace from '../../components/teacher/TeacherActionWorkspace'
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher'
export default function Attendance(){const{teacher,isLoading}=useCurrentTeacher();return <div><PageHeader title="Davomat" description="Sinfni tanlang va bugungi davomatni belgilang."/>{isLoading&&<Loader/>}{!isLoading&&!teacher&&<EmptyState message="O‘qituvchi profili topilmadi."/>}{teacher&&<TeacherActionWorkspace teacher={teacher} mode="attendance"/>}</div>}
