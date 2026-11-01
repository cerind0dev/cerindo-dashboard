import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AlkesTableSkeleton() {
	return (
		<div
			className="flex min-h-96 max-w-full flex-auto flex-col overflow-auto"
			role="status"
			aria-label="Loading Alkes data"
		>
			<Card className="rounded-none border-0 shadow-none">
				<CardContent className="flex w-full flex-col gap-8">
					{Array.from({ length: 8 }).map((_, index) => (
						<div className="flex gap-4" key={index}>
							<Skeleton className="h-8 flex-2" />
							<Skeleton className="hidden h-8 flex-6 lg:block" />
							<Skeleton className="hidden h-8 flex-1 lg:block" />
							<Skeleton className="h-8 flex-1" />
							<Skeleton className="h-8 flex-1" />
							<Skeleton className="h-8 flex-1" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	)
}
