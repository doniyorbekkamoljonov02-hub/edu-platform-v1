import PageHeader from '../../components/ui/PageHeader'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import TeacherActionWorkspace from '../../components/teacher/TeacherActionWorkspace'
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher'
export default function Grades(){const{teacher,isLoading}=useCurrentTeacher();return <div><PageHeader title="Baholar" description="Sinf va o‘quvchini tanlab baho qo‘ying."/>{isLoading&&<Loader/>}{!isLoading&&!teacher&&<EmptyState message="O‘qituvchi profili topilmadi."/>}{teacher&&<TeacherActionWorkspace teacher={teacher} mode="grade"/>}</div>}
