import { Bell } from 'lucide-react'

import MyNotificationsList from '../../components/common/MyNotificationsList'

function Notifications() {
  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-[#DB9558] p-6 text-white shadow-xl shadow-[#DB9558]/20 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-white/[0.07]" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <Bell size={14} />
                Bildirishnomalar
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Xabarnomalar
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                Baholar, davomat va yangiliklar haqidagi barcha
                bildirishnomalaringiz shu yerda. O‘qilmagan xabarni bosing —
                u o‘qilgan deb belgilanadi.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm sm:h-20 sm:w-20">
              <Bell size={38} strokeWidth={1.7} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#DB9558]/15 bg-white p-4 shadow-sm sm:p-6">
          <MyNotificationsList />
        </section>
      </div>
    </div>
  )
}

export default Notifications
