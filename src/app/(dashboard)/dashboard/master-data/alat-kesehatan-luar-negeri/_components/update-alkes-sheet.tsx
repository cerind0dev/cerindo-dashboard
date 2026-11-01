'use client'

import { useQuery } from '@tanstack/react-query'

import { getAlkesByIdQueryOptions } from '@/lib/features/alkes/alkes-queries'
import { useAlkesIdQueryString } from '@/lib/features/alkes/utils'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import UpdateAlkesForm from './forms/update-alkes-form'

export default function UpdateAlkesSheet() {
	const [alkesIdQueryString, setAlkesIdQueryString] = useAlkesIdQueryString()
	const { data, isPending } = useQuery(getAlkesByIdQueryOptions(alkesIdQueryString!))

	const closeSheet = () => setAlkesIdQueryString(null)

	return (
		<SheetContent
			className="overflow-y-scroll"
			side="right"
			showCloseButton={false}
			onCloseAutoFocus={(event) => event.preventDefault()}
		>
			<SheetHeader className="pb-0">
				<SheetTitle>Update Data Alkes</SheetTitle>
				<SheetDescription>Data alkes yang akan diupdate: {alkesIdQueryString?.split('_').join(' ')}</SheetDescription>
			</SheetHeader>
			{!data || isPending ? (
				<Card className="flex-1 rounded-none border-0 shadow-none">
					<CardContent className="mt-4 flex w-full flex-col gap-7">
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-8 w-full" />
						</div>
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-8 w-full" />
						</div>
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-8 w-full" />
						</div>
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-8 w-full" />
						</div>
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-8 w-full" />
						</div>
					</CardContent>
					<CardFooter className="mt-auto flex flex-col gap-4">
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
					</CardFooter>
				</Card>
			) : (
				<UpdateAlkesForm alkes={data} onActionSuccess={closeSheet} className="p-4" />
			)}
		</SheetContent>
	)
}
