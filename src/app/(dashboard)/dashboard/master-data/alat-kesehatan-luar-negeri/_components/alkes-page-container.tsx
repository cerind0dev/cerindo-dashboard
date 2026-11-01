'use client'

import { useAlkesIdQueryString } from '@/lib/features/alkes/utils'

import { Sheet } from '@/components/ui/sheet'

import AlkesTable from './alkes-table'
import UpdateAlkesSheet from './update-alkes-sheet'

export default function AlkesPageContainer() {
	const [alkesIdQueryString, setAlkesIdQueryString] = useAlkesIdQueryString()

	return (
		<Sheet open={!!alkesIdQueryString} onOpenChange={(open) => !open && setAlkesIdQueryString(null)}>
			<UpdateAlkesSheet />
			<AlkesTable />
		</Sheet>
	)
}
