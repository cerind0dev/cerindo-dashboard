'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { getAlkesByIdQueryOptions } from '@/lib/features/alkes/alkes-queries'
import { useAlkesIdQueryString } from '@/lib/features/alkes/utils'

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import UpdateAlkesForm from './forms/update-alkes-form'

export default function UpdateAlkesSheet() {
	const [alkesIdQueryString, setAlkesIdQueryString] = useAlkesIdQueryString()
	const { data, isPending, error } = useQuery(getAlkesByIdQueryOptions(alkesIdQueryString!))

	const closeSheet = () => setAlkesIdQueryString(null)

	return (
		<SheetContent side="right" showCloseButton={false} onCloseAutoFocus={(event) => event.preventDefault()}>
			{!data || isPending ? (
				<div>Loading...</div>
			) : (
				<React.Fragment>
					<SheetHeader className="pb-0">
						<SheetTitle>Update Data Alkes</SheetTitle>
						<SheetDescription>Data alkes yang akan diupdate: {data.id.split('_').join(' ')}</SheetDescription>
					</SheetHeader>
					<UpdateAlkesForm alkes={data} onActionSuccess={closeSheet} className="p-4" />
				</React.Fragment>
			)}
		</SheetContent>
	)
}
