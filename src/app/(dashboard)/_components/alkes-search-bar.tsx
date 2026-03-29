'use client'

import React, { useMemo, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getAlkesItemsByTypeQueryOptions } from '@/lib/features/alkes/alkes-queries'
import { useAlkesActions, useDistinctAlkes } from '@/lib/features/alkes/alkes-store-provider'
import { useClickOutside } from '@/lib/hooks/use-click-outside'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import type { AlkesItem } from '@/lib/features/alkes/alkes.types'

export default function AlkesSearchBar() {
	const [query, setQuery] = useState<string>('')
	const debouncedQuery = useDebounce<string>(query, 200)
	const currentDate = useMemo(() => new Date(), [])

	const alkes = useDistinctAlkes()
	const { addAlkesItem } = useAlkesActions()

	const { data, isPending, error } = useQuery(getAlkesItemsByTypeQueryOptions(debouncedQuery))

	const alkesSearchBarRef = useRef<HTMLDivElement>(null)
	useClickOutside({ ref: alkesSearchBarRef, handler: () => setQuery('') })

	const isTyping = query !== debouncedQuery

	const handleSaveAlkesItem = (alkesItem: AlkesItem) => {
		const duplicateAlkes = alkes.some((item) => item.id === alkesItem.alkes.id)
		const alkesIdFormatted = alkesItem.alkes.id.split('_').join(' ')

		addAlkesItem(alkesItem)

		if (duplicateAlkes) {
			toast.warning(`${alkesIdFormatted} telah terdaftar`, { position: 'top-right' })
		} else {
			toast.success(`${alkesIdFormatted} berhasil ditambahkan`, { position: 'top-right' })
		}
	}

	return (
		<div ref={alkesSearchBarRef} className="relative flex flex-col items-center justify-center rounded-md">
			<InputGroup className="h-10">
				<InputGroupInput
					id="akl-type"
					name="akl-type"
					autoComplete="off"
					type="text"
					className="h-10"
					placeholder="Cari izin alkes berdasarkan tipe ART barang, contoh: 455666, 8701148SP"
					value={query}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value.trim())}
				/>
				<InputGroupAddon>
					<Icons.search className="size-4 text-primary" />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					{query !== '' && // use the query state to prevent ui lag because of the debounced query value
						(isTyping && isPending ? (
							<Icons.loader className="mr-2 size-4 animate-spin text-primary" aria-hidden="true" />
						) : (
							<React.Fragment>
								{data !== undefined && data.length > 0 ? data.length : 0} hasil pencarian
								<Button variant="ghost" size="icon-sm" className="rounded-full" onClick={() => setQuery('')}>
									<Icons.circleX className="size-4 text-primary" />
								</Button>
							</React.Fragment>
						))}
				</InputGroupAddon>
			</InputGroup>
			{query !== '' && (
				<Card
					className={cn(
						'absolute top-14 left-1/2 z-50 -translate-x-1/2 shadow-lg',
						data !== undefined && data.length === 0 && !isPending && 'w-full sm:w-max',
						((isTyping && isPending) || (data !== undefined && data.length > 0)) && 'w-full',
					)}
				>
					{isTyping && isPending ? (
						<CardContent>
							<Skeleton className="h-6 w-full rounded-md" />
							<Skeleton className="mt-2 h-6 w-96 rounded-md" />
						</CardContent>
					) : data !== undefined && data.length > 0 ? (
						<CardContent className="w-full p-0">
							<ScrollArea>
								<ul className="max-h-60">
									{data.map((alkes, index) => {
										return (
											<li
												key={`${alkes.id}-${index}`}
												className="cursor-pointer px-4 py-2 hover:bg-slate-100"
												onClick={() => {
													handleSaveAlkesItem(alkes)
												}}
											>
												<p className="font-bold">
													{alkes.alkes.brand_name} / {alkes.name}
												</p>
												<p className="text-slate-700">
													{alkes.type} - {alkes.alkes.countries.name}
												</p>
												<p className="mt-3 text-sm text-slate-700">
													<span className="font-semibold text-primary">Expiry date:</span>{' '}
													{new Date(alkes.alkes.expiry_date ? alkes.alkes.expiry_date : currentDate).toLocaleDateString(
														'id-ID',
													)}
												</p>
											</li>
										)
									})}
								</ul>
							</ScrollArea>
						</CardContent>
					) : (
						<CardContent className="px-4">Izin AKL yang Anda cari tidak ditemukan</CardContent>
					)}
				</Card>
			)}
		</div>
	)
}
