import PageHeader from '../../components/ui/PageHeader'
import BonusesList from '../../components/common/BonusesList'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { useCurrentChild } from '../../hooks/useCurrentChild'

function Bonuses() {
  const { child, isLoading } = useCurrentChild()

  return (
    <div>
      <PageHeader title="Bonuslar" description="Farzandingizga berilgan bonus ballar." />
      {isLoading && <Loader />}
      {!isLoading && !child && (
        <EmptyState message="Hisobingizga hali farzand biriktirilmagan." />
      )}
      {!isLoading && child && <BonusesList filterBy={{ studentId: child.id }} />}
    </div>
  )
}

export default Bonuses
