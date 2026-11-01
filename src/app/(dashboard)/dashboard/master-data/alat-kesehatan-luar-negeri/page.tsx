import { Suspense } from 'react'

import { rubik } from '@/config/font'

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'

import AlkesData from './_components/alkes-data'
import AlkesTableSkeleton from './_components/alkes-table-skeleton'

export default function MasterDataAlkesPage() {
	return (
		<div className="flex h-full flex-auto flex-col overflow-y-auto bg-white text-secondary-foreground">
			<div className="flex flex-col gap-6 border-b px-4 py-8">
				<PageHeader as={'div'} className="max-w-full px-5">
					<PageHeaderHeading className={`${rubik.className}`}>Master Data Alkes</PageHeaderHeading>
					<PageHeaderDescription>
						Tempat untuk operasi data alkes: tambah alkes baru, update alkes kadaluarsa, hapus alkes tidak terpakai, dan
						lainnya
					</PageHeaderDescription>
				</PageHeader>
			</div>
			<Suspense fallback={<AlkesTableSkeleton />}>
				<AlkesData />
			</Suspense>
		</div>
	)
}
