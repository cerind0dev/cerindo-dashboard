'use client'

import Icons from '@/components/icons'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

export default function AlkesSearchBar() {
	return (
		<InputGroup className="h-10">
			<InputGroupInput
				className="h-10"
				placeholder="Cari izin alkes berdasarkan tipe ART barang, contoh: 455666, 8701148SP"
			/>
			<InputGroupAddon>
				<Icons.search />
			</InputGroupAddon>
			<InputGroupAddon align="inline-end">... hasil pencarian</InputGroupAddon>
		</InputGroup>
	)
}
