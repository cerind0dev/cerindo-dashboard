import React from 'react'

import { rubik } from '@/config/font'

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import AlkesSearchBar from '@/app/(dashboard)/_components/alkes-search-bar'

export default async function SearchAlkesPage() {
	return (
		<div className="flex h-full flex-auto flex-col overflow-y-auto bg-white text-secondary-foreground">
			<div className="flex flex-col gap-6 border-b px-4 py-8">
				<PageHeader as={'div'} className="max-w-full px-5">
					<PageHeaderHeading className={`${rubik.className}`}>Pencarian Alkes</PageHeaderHeading>
					<PageHeaderDescription>Cari dan tinjau izin Alkes yang Anda butuhkan</PageHeaderDescription>
				</PageHeader>
				<div className="px-4">
					<AlkesSearchBar />
				</div>
			</div>
		</div>
	)
}
