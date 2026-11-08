import React from 'react'

import { HydrationBoundary } from '@tanstack/react-query'

import { rubik } from '@/config/font'
import { alkesCacheKey } from '@/lib/features/alkes/alkes-cache-key'
import { getAlkesSnapshot } from '@/lib/features/alkes/alkes-server'
import { dehydrate } from '@/lib/providers/query-hydrate'

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'

import AlkesTable from './_components/alkes-table'
import AlkesTableSkeleton from './_components/alkes-table-skeleton'

export default async function MasterDataAlkesPage() {
	return (
		<div className="flex h-full flex-auto flex-col overflow-y-auto bg-white text-secondary-foreground">
			<div className="flex flex-col gap-6 px-4 py-8">
				<PageHeader as={'div'} className="max-w-full px-5">
					<PageHeaderHeading size="md" className={`${rubik.className}`}>
						Master Data Alkes
					</PageHeaderHeading>
					<PageHeaderDescription size="sm">
						Tempat untuk operasi data alkes: tambah alkes baru, update alkes kadaluarsa, hapus alkes tidak terpakai, dan
						lainnya
					</PageHeaderDescription>
				</PageHeader>
			</div>
			<React.Suspense fallback={<AlkesTableSkeleton />}>
				<AlkesData />
			</React.Suspense>
		</div>
	)
}

async function AlkesData() {
	const alkes = await getAlkesSnapshot()
	const state = await dehydrate([{ queryKey: alkesCacheKey.key, data: alkes }], { tags: [alkesCacheKey.tag] })

	return (
		<HydrationBoundary state={state}>
			<AlkesTable />
		</HydrationBoundary>
	)
}
