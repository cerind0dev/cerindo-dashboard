'use client'

import React, { useMemo, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import {
	getAlkesByIdQueryOptions,
	getAlkesItemsByAlkesIdQueryOptions,
	getAlkesQueryOptions,
} from '@/lib/features/alkes/alkes-queries'
import { useAlkesIdQueryString } from '@/lib/features/alkes/utils'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/utils'

import { DataTable, DataTableColumnHeader } from '@/components/data-table'
import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { SheetTrigger } from '@/components/ui/sheet'

import AlkesItemsTable from './alkes-items-table'

import type { AlkesWithCountriesAndHscode } from '@/lib/features/alkes/alkes.types'
import type { PaginationState, Row } from '@tanstack/react-table'

interface AlkesTableRowDetailProps {
	row: Row<AlkesWithCountriesAndHscode[number]>
}

function AlkesTableRowDetail({ row }: AlkesTableRowDetailProps) {
	return <AlkesItemsTable alkesId={row.id} />
}

export default function AlkesTable() {
	const supabase = createClient()
	const queryClient = useQueryClient()

	const { data, isPending, error } = useQuery(getAlkesQueryOptions(supabase)) // get all alkes
	const [, setAlkesIdQueryString] = useAlkesIdQueryString()

	const columnHelper = createColumnHelper<AlkesWithCountriesAndHscode[number]>()
	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'alkes-open-sheet',
				header: '',
				cell: (info) => {
					const prefetchAlkesById = async () => {
						await queryClient.prefetchQuery(getAlkesByIdQueryOptions(info.getValue()))
					}

					return (
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full"
								onMouseEnter={prefetchAlkesById}
								onClick={() => setAlkesIdQueryString(info.getValue())}
							>
								<Icons.ellipsisVertical className="size-4 text-primary" />
								<span className="sr-only">Open alkes sheet</span>
							</Button>
						</SheetTrigger>
					)
				},
				meta: {
					headerClassName: 'pr-0',
					rowClassName: 'pr-0',
				},
			}),
			columnHelper.accessor('id', {
				id: 'alkes-id',
				header: () => <DataTableColumnHeader title="ID Alkes" />,
				cell: (info) => {
					const normalizedAlkesIdText = info.getValue().split('_').join(' ')
					return <span>{normalizedAlkesIdText}</span>
				},
			}),
			columnHelper.accessor('brand_name', {
				id: 'alkes-brand-name',
				header: () => <DataTableColumnHeader title="Merek Dagang" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell',
				},
			}),
			columnHelper.accessor((row) => `${row.countries.name} / ${row.countries.code}`, {
				id: 'alkes-country',
				header: () => <DataTableColumnHeader title="Negara" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell',
				},
			}),
			columnHelper.accessor('hscode.code', {
				id: 'alkes-hscode',
				header: () => <DataTableColumnHeader title="HS Code" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
			}),
			columnHelper.accessor('expiry_date', {
				id: 'alkes-status',
				header: () => <DataTableColumnHeader title="Status" />,
				cell: (info) => (
					<span
						className={cn(
							'inline-flex flex-row items-center gap-x-1 rounded-full px-2 py-0.5',
							new Date(info.getValue()) < new Date()
								? 'bg-destructive/10 text-destructive/60'
								: 'bg-green-100 text-green-600',
						)}
					>
						{new Date(info.getValue()) < new Date() ? (
							<React.Fragment>
								<Icons.circleX strokeWidth={3} className="size-4" />
								<span>Kadaluarsa</span>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Icons.circleCheckBig strokeWidth={3} className="size-4" />
								<span>Aktif</span>
							</React.Fragment>
						)}
					</span>
				),
			}),
			columnHelper.accessor('id', {
				id: 'alkes-details',
				header: () => <DataTableColumnHeader title="Details" />,
				cell: (info) => {
					const prefetchAlkesItem = async () => {
						await queryClient.prefetchQuery(getAlkesItemsByAlkesIdQueryOptions(info.getValue()))
					}

					return (
						<CollapsibleTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full"
								onClick={prefetchAlkesItem}
								onFocus={prefetchAlkesItem}
							>
								<Icons.chevronDown className="size-4 text-primary" />
								<span className="sr-only">Open row details</span>
							</Button>
						</CollapsibleTrigger>
					)
				},
				meta: {
					headerClassName: 'pl-0',
					rowClassName: 'pl-0',
				},
			}),
		],
		[columnHelper, queryClient],
	)

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 15,
	})

	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		getRowId: (row) => row.id,
		state: { pagination },
		autoResetAll: false,
	})

	return (
		<div className="flex max-w-full flex-auto flex-col overflow-auto">
			{isPending ? (
				<div>Loading...</div>
			) : (
				<DataTable
					table={table}
					stickyHeader={true}
					emptyDataText="Tidak ada data alkes"
					renderRowDetails={(row) => <AlkesTableRowDetail row={row} />}
				/>
			)}
		</div>
	)
}
