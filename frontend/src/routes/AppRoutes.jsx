import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { ROLES } from '../constants/roles'
import { ROLE_HOME_PATH } from '../constants/roleLabels'

import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

// ==============================
// AUTH PAGES
// ==============================

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

// ==============================
// LAYOUTS
// ==============================

import StudentLayout from '../layouts/StudentLayout'
import TeacherLayout from '../layouts/TeacherLayout'
import ParentLayout from '../layouts/ParentLayout'
import AdminLayout from '../layouts/AdminLayout'
import DirectorLayout from '../layouts/DirectorLayout'

// ==============================
// STUDENT PAGES
// ==============================

import StudentDashboard from '../pages/student/Dashboard'
import StudentGrades from '../pages/student/Grades'
import StudentAttendance from '../pages/student/Attendance'
import StudentRanking from '../pages/student/Ranking'
import StudentBonuses from '../pages/student/Bonuses'
import StudentSchedule from '../pages/student/Schedule'
import StudentNews from '../pages/student/News'
import StudentProfile from '../pages/student/Profile'
import StudentChat from '../pages/student/Chat'

// ==============================
// TEACHER PAGES
// ==============================

import TeacherDashboard from '../pages/teacher/Dashboard'
import TeacherStudents from '../pages/teacher/Students'
import TeacherAttendance from '../pages/teacher/Attendance'
import TeacherGrades from '../pages/teacher/Grades'
import TeacherBonuses from '../pages/teacher/Bonuses'
import TeacherSchedule from '../pages/teacher/Schedule'
import TeacherMonitoring from '../pages/teacher/Monitoring'
import TeacherProfile from '../pages/teacher/Profile'
import TeacherNews from '../pages/teacher/News'
import TeacherChat from '../pages/teacher/Chat'

// ==============================
// PARENT PAGES
// ==============================

import ParentDashboard from '../pages/parent/Dashboard'
import ParentChildProfile from '../pages/parent/ChildProfile'
import ParentGrades from '../pages/parent/Grades'
import ParentAttendance from '../pages/parent/Attendance'
import ParentRanking from '../pages/parent/Ranking'
import ParentBonuses from '../pages/parent/Bonuses'
import ParentSchedule from '../pages/parent/Schedule'
import ParentNotifications from '../pages/parent/Notifications'
import ParentProfile from '../pages/parent/Profile'
import ParentChat from '../pages/parent/Chat'
import ParentNews from '../pages/parent/News'

// ==============================
// ADMIN PAGES
// ==============================

import AdminDashboard from '../pages/admin/Dashboard'
import AdminStudents from '../pages/admin/Students'
import AdminTeachers from '../pages/admin/Teachers'
import AdminParents from '../pages/admin/Parents'
import AdminSubjects from '../pages/admin/Subjects'
import AdminGroups from '../pages/admin/Groups'
import AdminSchedule from '../pages/admin/Schedule'
import AdminNews from '../pages/admin/News'
import AdminChat from '../pages/admin/Chat'
import AdminAccounts from '../pages/admin/Accounts'
import AdminProfile from '../pages/admin/Profile'

// ==============================
// DIRECTOR PAGES
// ==============================

import DirectorDashboard from '../pages/director/Dashboard'
import DirectorUsers from '../pages/director/Users'
import DirectorStudents from '../pages/director/Students'
import DirectorTeachers from '../pages/director/Teachers'
import DirectorAdmins from '../pages/director/Admins'
import DirectorSubjects from '../pages/director/Subjects'
import DirectorGroups from '../pages/director/Groups'
import DirectorSchedule from '../pages/director/Schedule'
import DirectorReports from '../pages/director/Reports'
import DirectorPermissions from '../pages/director/Permissions'
import DirectorSettings from '../pages/director/Settings'
import DirectorProfile from '../pages/director/Profile'
import DirectorNews from '../pages/director/News'
import DirectorChat from '../pages/director/Chat'

// ==============================
// ROOT REDIRECT
// ==============================

function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#14B8A6]" />

          <p className="text-sm text-gray-500">
            Yuklanmoqda...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const homePath = ROLE_HOME_PATH[user?.role]

  if (!homePath) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={homePath} replace />
}

// ==============================
// APP ROUTES
// ==============================

function AppRoutes() {
  return (
    <Routes>
      {/* =================================
          PUBLIC ROUTES
      ================================= */}

      <Route
        path="/"
        element={<RootRedirect />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* =================================
          PROTECTED ROUTES
      ================================= */}

      <Route element={<ProtectedRoute />}>

        {/* =================================
            STUDENT
        ================================= */}

        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.STUDENT]} />
          }
        >
          <Route
            path="/student"
            element={<StudentLayout />}
          >
            <Route
              path="dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="grades"
              element={<StudentGrades />}
            />

            <Route
              path="attendance"
              element={<StudentAttendance />}
            />

            <Route
              path="ranking"
              element={<StudentRanking />}
            />

            <Route
              path="bonuses"
              element={<StudentBonuses />}
            />

            <Route
              path="schedule"
              element={<StudentSchedule />}
            />

            <Route
              path="news"
              element={<StudentNews />}
            />

            {/* CHAT */}
            <Route
              path="chat"
              element={<StudentChat />}
            />

            <Route
              path="profile"
              element={<StudentProfile />}
            />
          </Route>
        </Route>

        {/* =================================
            TEACHER
        ================================= */}

        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.TEACHER]} />
          }
        >
          <Route
            path="/teacher"
            element={<TeacherLayout />}
          >
            <Route
              path="dashboard"
              element={<TeacherDashboard />}
            />

            <Route
              path="students"
              element={<TeacherStudents />}
            />

            <Route
              path="attendance"
              element={<TeacherAttendance />}
            />

            <Route
              path="grades"
              element={<TeacherGrades />}
            />

            <Route
              path="bonuses"
              element={<TeacherBonuses />}
            />

            <Route
              path="schedule"
              element={<TeacherSchedule />}
            />

            <Route
              path="monitoring"
              element={<TeacherMonitoring />}
            />

            <Route path="news" element={<TeacherNews />} />

            <Route
              path="chat"
              element={<TeacherChat />}
            />

            <Route
              path="profile"
              element={<TeacherProfile />}
            />
          </Route>
        </Route>

        {/* =================================
            PARENT
        ================================= */}

        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.PARENT]} />
          }
        >
          <Route
            path="/parent"
            element={<ParentLayout />}
          >
            <Route
              path="dashboard"
              element={<ParentDashboard />}
            />

            <Route
              path="child"
              element={<ParentChildProfile />}
            />

            <Route
              path="grades"
              element={<ParentGrades />}
            />

            <Route
              path="attendance"
              element={<ParentAttendance />}
            />

            <Route
              path="ranking"
              element={<ParentRanking />}
            />

            <Route
              path="bonuses"
              element={<ParentBonuses />}
            />

            <Route
              path="schedule"
              element={<ParentSchedule />}
            />

            <Route
              path="notifications"
              element={<ParentNotifications />}
            />

            <Route
              path="news"
              element={<ParentNews />}
            />

            <Route
              path="chat"
              element={<ParentChat />}
            />

            <Route
              path="profile"
              element={<ParentProfile />}
            />
          </Route>
        </Route>

        {/* =================================
            ADMIN
        ================================= */}

        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]} />
          }
        >
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="students"
              element={<AdminStudents />}
            />

            <Route
              path="teachers"
              element={<AdminTeachers />}
            />

            <Route
              path="parents"
              element={<AdminParents />}
            />

            <Route
              path="subjects"
              element={<AdminSubjects />}
            />

            <Route
              path="groups"
              element={<AdminGroups />}
            />

            <Route
              path="schedule"
              element={<AdminSchedule />}
            />

            <Route
              path="news"
              element={<AdminNews />}
            />

            <Route
              path="accounts"
              element={<AdminAccounts />}
            />

            <Route
              path="chat"
              element={<AdminChat />}
            />

            <Route
              path="profile"
              element={<AdminProfile />}
            />
          </Route>
        </Route>

        {/* =================================
            DIRECTOR
        ================================= */}

        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.DIRECTOR]} />
          }
        >
          <Route
            path="/director"
            element={<DirectorLayout />}
          >
            <Route
              path="dashboard"
              element={<DirectorDashboard />}
            />

            <Route
              path="users"
              element={<DirectorUsers />}
            />

            <Route
              path="students"
              element={<DirectorStudents />}
            />

            <Route
              path="teachers"
              element={<DirectorTeachers />}
            />

            <Route
              path="admins"
              element={<DirectorAdmins />}
            />

            <Route
              path="subjects"
              element={<DirectorSubjects />}
            />

            <Route
              path="groups"
              element={<DirectorGroups />}
            />

            <Route
              path="schedule"
              element={<DirectorSchedule />}
            />

            <Route
              path="reports"
              element={<DirectorReports />}
            />

            <Route
              path="permissions"
              element={<DirectorPermissions />}
            />

            <Route
              path="settings"
              element={<DirectorSettings />}
            />

            <Route path="news" element={<DirectorNews />} />

            <Route
              path="chat"
              element={<DirectorChat />}
            />

            <Route
              path="profile"
              element={<DirectorProfile />}
            />
          </Route>
        </Route>
      </Route>

      {/* =================================
          404
      ================================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default AppRoutes
