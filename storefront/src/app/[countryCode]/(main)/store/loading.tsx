import { Container } from '@modules/common/components/container'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'

export default function Loading() {
  return (
    <Container className="flex flex-col gap-8 !py-8">
      <div className="h-10 w-[200px] animate-pulse bg-skeleton-primary" />
      <SkeletonProductGrid />
    </Container>
  )
}
