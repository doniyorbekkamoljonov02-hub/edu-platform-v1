import { ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { ROLE_LABELS } from '../../constants/roleLabels'
import { ROLES } from '../../constants/roles'

const ROLE_DESCRIPTIONS = {
  [ROLES.STUDENT]: 'Faqat o‘ziga tegishli baholar, davomat, reyting va dars jadvalini ko‘radi.',
  [ROLES.TEACHER]: 'Faqat o‘ziga biriktirilgan fan va guruhlar bo‘yicha davomat/baho kiritadi.',
  [ROLES.PARENT]: 'Faqat o‘z farzandiga tegishli ma’lumotlarni ko‘radi.',
  [ROLES.ADMIN]: 'O‘quvchi, o‘qituvchi, fan, guruh va dars jadvalini boshqaradi.',
  [ROLES.DIRECTOR]: 'Barcha ma’lumotlarni ko‘radi va adminlarni boshqaradi.',
}

/**
 * Roles and their access are enforced server-side (see backend/src/common/guards).
 * There is no dynamic permission editor yet, so this page shows the current,
 * real rules instead of interactive controls that wouldn't do anything.
 */
function Permissions() {
  return (
    <div>
      <PageHeader
        title="Ruxsatlar"
        description="Har bir rol uchun tizimda amalda bo‘lgan ruxsatlar."
      />
      <div className="space-y-3">
        {Object.values(ROLES).map((role) => (
          <div
            key={role}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{ROLE_LABELS[role]}</p>
              <p className="text-sm text-gray-500">{ROLE_DESCRIPTIONS[role]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Permissions
