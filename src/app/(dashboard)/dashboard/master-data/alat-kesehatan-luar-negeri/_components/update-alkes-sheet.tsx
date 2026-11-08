'use client'

import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { getAlkesByIdQueryOptions } from '@/lib/features/alkes/alkes-queries'
import { useAlkesIdQueryString } from '@/lib/features/alkes/utils'
import { getErrorMessage } from '@/lib/utils/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import UpdateAlkesForm from './forms/update-alkes-form'

export default function UpdateAlkesSheet() {
	const [alkesIdQueryString, setAlkesIdQueryString] = useAlkesIdQueryString()

	const closeSheet = () => setAlkesIdQueryString(null)

	return (
		<SheetContent
			className="overflow-y-scroll"
			side="right"
			showCloseButton
			onCloseAutoFocus={(event) => event.preventDefault()}
		>
			<SheetHeader>
				<SheetTitle>Update Data Alkes</SheetTitle>
				<SheetDescription>Data alkes yang akan diupdate: {alkesIdQueryString?.split('_').join(' ')}</SheetDescription>
			</SheetHeader>
			{alkesIdQueryString && (
				<UpdateAlkesSheetForm key={alkesIdQueryString} id={alkesIdQueryString} onActionSuccess={closeSheet} />
			)}
		</SheetContent>
	)
}

interface UpdateAlkesSheetFormProps {
	id: string
	onActionSuccess: () => void
}

/*
 * DOCS: mount inside the sheet portal so every opening gets a new query observer.
 */
function UpdateAlkesSheetForm({ id, onActionSuccess }: UpdateAlkesSheetFormProps) {
	const { data, isPending, isFetching, isFetchedAfterMount, isSuccess, error, refetch } = useQuery({
		...getAlkesByIdQueryOptions(id),
		refetchOnMount: 'always',
	})
	const [hasLoaded, setHasLoaded] = useState(false)

	/*
	 * DOCS: once editing starts, background refreshes must not unmount the form.
	 */
	if (!hasLoaded && isFetchedAfterMount && isSuccess && !isFetching) {
		setHasLoaded(true)
	}

	return (
		<React.Fragment>
			{error && (
				<Card className="flex-1 rounded-none border-0 shadow-none">
					<CardHeader>Ada masalah pengambilan data!</CardHeader>
					<CardContent role="alert">{getErrorMessage(error)}</CardContent>
					<CardFooter>
						<Button type="button" disabled={isFetching} onClick={() => void refetch()}>
							{isFetching ? 'Mencoba lagi...' : 'Coba lagi'}
						</Button>
					</CardFooter>
				</Card>
			)}
			{!hasLoaded || isPending || !data ? (
				!error && <UpdateAlkesSheetSkeleton />
			) : (
				<UpdateAlkesForm alkes={data} onActionSuccess={onActionSuccess} className="p-4" />
			)}
		</React.Fragment>
	)
}

function UpdateAlkesSheetSkeleton() {
	return (
		<Card className="flex-1 rounded-none border-0 shadow-none">
			<CardHeader>
				<Skeleton className="h-4 w-2/3" />
				<Skeleton className="h-4 w-1/2" />
			</CardHeader>
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
	)
}
