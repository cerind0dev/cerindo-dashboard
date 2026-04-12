import React from 'react'

import { rubik } from '@/config/font'

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import SearchAlkesFooter from '@/app/(dashboard)/dashboard/search-alkes/_components/search-alkes-footer'
import SearchAlkesSearchBar from '@/app/(dashboard)/dashboard/search-alkes/_components/search-alkes-search-bar'
import SearchAlkesTable from '@/app/(dashboard)/dashboard/search-alkes/_components/search-alkes-table'

export default async function SearchAlkesPage() {
	return (
		<div className="flex h-full flex-auto flex-col overflow-y-auto bg-white text-secondary-foreground">
			<div className="flex flex-col gap-6 border-b px-4 py-8">
				<PageHeader as={'div'} className="max-w-full px-5">
					<PageHeaderHeading className={`${rubik.className}`}>Pencarian Alkes</PageHeaderHeading>
					<PageHeaderDescription>Cari dan tinjau izin Alkes yang Anda butuhkan</PageHeaderDescription>
				</PageHeader>
				<div className="px-4">
					<SearchAlkesSearchBar />
				</div>
			</div>
			<SearchAlkesTable />
			<SearchAlkesFooter />
		</div>
	)
}
