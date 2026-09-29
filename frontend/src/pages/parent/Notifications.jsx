import PageHeader from '../../components/ui/PageHeader'
import MyNotificationsList from '../../components/common/MyNotificationsList'

function Notifications() {
  return (
    <div>
      <PageHeader title="Xabarlar" description="Sizga yuborilgan bildirishnomalar." />
      <MyNotificationsList />
    </div>
  )
}

export default Notifications
