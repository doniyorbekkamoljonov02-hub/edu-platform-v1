import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Trophy,
  Gift,
  Calendar,
  Newspaper,
  User,
  MessageCircle,
  Users,
  GraduationCap,
  UsersRound,
  Layers,
  ClipboardList,
  UserCog,
  Bell,
  ShieldCheck,
  Settings,
  FileBarChart,
} from 'lucide-react'

/* ==============================
   STUDENT NAVIGATION
   ============================== */

export const studentNav = [
  { to: '/student/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { to: '/student/grades', label: 'Baholarim', icon: BookOpen },
  { to: '/student/chat', label: 'Xabarlar', icon: MessageCircle },
  { to: '/student/schedule', label: 'Jadval', icon: Calendar },
  { to: '/student/attendance', label: 'Davomatim', icon: ClipboardCheck },
  { to: '/student/ranking', label: 'Reytingim', icon: Trophy },
  { to: '/student/bonuses', label: 'Bonuslarim', icon: Gift },
  { to: '/student/news', label: 'Yangiliklar', icon: Newspaper },
  { to: '/student/profile', label: 'Profil', icon: User },
]

/* ==============================
   TEACHER NAVIGATION
   ============================== */

export const teacherNav = [
  { to: '/teacher/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { to: '/teacher/students', label: 'O‘quvchilar', icon: Users },
  { to: '/teacher/chat', label: 'Xabarlar', icon: MessageCircle },
  { to: '/teacher/schedule', label: 'Jadval', icon: Calendar },
  { to: '/teacher/attendance', label: 'Davomat', icon: ClipboardCheck },
  { to: '/teacher/grades', label: 'Baholar', icon: BookOpen },
  { to: '/teacher/bonuses', label: 'Bonuslar', icon: Gift },
  { to: '/teacher/monitoring', label: 'Natijalar', icon: FileBarChart },
  { to: '/teacher/news', label: 'Yangiliklar', icon: Newspaper },
  { to: '/teacher/profile', label: 'Profil', icon: User },
]

/* ==============================
   PARENT NAVIGATION
   ============================== */

export const parentNav = [
  { to: '/parent/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { to: '/parent/child', label: 'Farzandim', icon: UsersRound },
  { to: '/parent/chat', label: 'Xabarlar', icon: MessageCircle },
  { to: '/parent/grades', label: 'Baholar', icon: BookOpen },
  { to: '/parent/attendance', label: 'Davomat', icon: ClipboardCheck },
  { to: '/parent/ranking', label: 'Reyting', icon: Trophy },
  { to: '/parent/bonuses', label: 'Bonuslar', icon: Gift },
  { to: '/parent/schedule', label: 'Dars jadvali', icon: Calendar },
  { to: '/parent/notifications', label: 'Bildirishnomalar', icon: Bell },
  { to: '/parent/news', label: 'Yangiliklar', icon: Newspaper },
  { to: '/parent/profile', label: 'Profil', icon: User },
]

/* ==============================
   ADMIN NAVIGATION
   ============================== */

export const adminNav = [
  { to: '/admin/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { to: '/admin/students', label: 'O‘quvchilar', icon: Users },
  { to: '/admin/chat', label: 'Xabarlar', icon: MessageCircle },
  { to: '/admin/schedule', label: 'Jadval', icon: Calendar },
  { to: '/admin/teachers', label: 'O‘qituvchilar', icon: GraduationCap },
  { to: '/admin/parents', label: 'Ota-onalar', icon: UsersRound },
  { to: '/admin/subjects', label: 'Fanlar', icon: Layers },
  { to: '/admin/groups', label: 'Guruhlar', icon: ClipboardList },
  { to: '/admin/news', label: 'Yangiliklar', icon: Newspaper },
  { to: '/admin/accounts', label: 'Hisoblar', icon: UserCog },
  { to: '/admin/profile', label: 'Profil', icon: User },
]

/* ==============================
   DIRECTOR NAVIGATION
   ============================== */

export const directorNav = [
  { to: '/director/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { to: '/director/users', label: 'Foydalanuvchilar', icon: Users },
  { to: '/director/chat', label: 'Xabarlar', icon: MessageCircle },
  { to: '/director/schedule', label: 'Jadval', icon: Calendar },
  { to: '/director/students', label: 'O‘quvchilar', icon: Users },
  { to: '/director/teachers', label: 'O‘qituvchilar', icon: GraduationCap },
  { to: '/director/admins', label: 'Adminlar', icon: ShieldCheck },
  { to: '/director/subjects', label: 'Fanlar', icon: Layers },
  { to: '/director/groups', label: 'Guruhlar', icon: ClipboardList },
  { to: '/director/reports', label: 'Hisobotlar', icon: FileBarChart },
  { to: '/director/permissions', label: 'Ruxsatlar', icon: ShieldCheck },
  { to: '/director/settings', label: 'Sozlamalar', icon: Settings },
  { to: '/director/news', label: 'Yangiliklar', icon: Newspaper },
  { to: '/director/profile', label: 'Profil', icon: User },
]
