import PageHeader from '../../components/ui/PageHeader'
import RankingView from '../../components/common/RankingView'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { useCurrentChild } from '../../hooks/useCurrentChild'

function Ranking() {
  const { child, isLoading } = useCurrentChild()

  return (
    <div>
      <PageHeader title="Reyting" description="Farzandingizning guruh ichidagi reytingi." />
      {isLoading && <Loader />}
      {!isLoading && !child && (
        <EmptyState message="Hisobingizga hali farzand biriktirilmagan." />
      )}
      {!isLoading && child && <RankingView studentId={child.id} />}
    </div>
  )
}

export default Ranking
