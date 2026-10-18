'use client'

import { rubik } from '@/config/font'
import { useAlkesIdQueryString } from '@/lib/features/alkes/utils'

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { Sheet } from '@/components/ui/sheet'

import AlkesTable from './alkes-table'
import UpdateAlkesSheet from './update-alkes-sheet'

export default function AlkesPageContainer() {
	const [alkesIdQueryString, setAlkesIdQueryString] = useAlkesIdQueryString()

	return (
		<Sheet open={!!alkesIdQueryString} onOpenChange={(open) => !open && setAlkesIdQueryString(null)}>
			<UpdateAlkesSheet />
			<div className="flex h-full flex-auto flex-col overflow-y-auto bg-white text-secondary-foreground">
				<div className="flex flex-col gap-6 border-b px-4 py-8">
					<PageHeader as={'div'} className="max-w-full px-5">
						<PageHeaderHeading className={`${rubik.className}`}>Master Data Alkes</PageHeaderHeading>
						<PageHeaderDescription>
							Tempat untuk operasi data alkes: tambah alkes baru, update alkes kadaluarsa, hapus alkes tidak terpakai,
							dan lainnya
						</PageHeaderDescription>
					</PageHeader>
				</div>
				<AlkesTable />
			</div>
		</Sheet>
	)
}
