'use client'

import React, { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import { useAlkesActions, useAlkesItems } from '@/lib/features/alkes/alkes-store-provider'
import { cn } from '@/lib/utils/utils'

import useDataTable from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table/data-table'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CollapsibleTrigger } from '@/components/ui/collapsible'

import type { AlkesItemsByTypeWithCountriesAndHscode } from '@/lib/features/alkes/alkes.types'
import type { Row } from '@tanstack/react-table'

interface SearchAlkesRowDetailProps {
	row: Row<AlkesItemsByTypeWithCountriesAndHscode[number]>
}

function SearchAlkesRowDetail({ row }: SearchAlkesRowDetailProps) {
	const data = row.original
	const { deleteAlkesItem } = useAlkesActions()

	return (
		<React.Fragment>
			<div className="grid grid-cols-12 gap-5 px-6 py-8">
				<div className="col-span-12 space-y-4 xl:col-span-6">
					<div className="grid grid-cols-4 gap-4">
						<div className="col-span-4 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-2">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Kode AKL</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.id.split('_').join(' ')}</p>
						</div>
						<div className="col-span-4 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Tipe</p>
							<p className="mt-1 text-sm text-primary/85">{data.type}</p>
						</div>
						<div className="col-span-4 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">HS Code</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.hscode.code}</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Merek</p>
							<p className="mt-1 truncate text-sm text-primary/85">{data.alkes.brand_name}</p>
						</div>
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Kemasan</p>
							<p className="mt-1 truncate text-sm text-primary/85">{data.alkes.packaging}</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Negara asal</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.countries.name}</p>
						</div>
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
								Kode negara asal
							</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.countries.code}</p>
						</div>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
							Deskripsi di alkes
						</p>
						<p className="mt-1 truncate text-sm text-primary/85">{data.name !== null ? data.name : '-'}</p>
					</div>
				</div>
				<div className="col-span-12 space-y-4 xl:col-span-3">
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Biaya masuk</p>
						<p className="relative mt-1 text-sm text-primary/85">
							{data.alkes.hscode.import_dutyfees}
							<span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">PPN</p>
						<p className="relative mt-1 text-sm text-primary/85">
							{data.alkes.hscode.value_added_tax}
							<span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
							PPH &#40;API&#41;
						</p>
						<p className="relative mt-1 text-sm text-primary/85">
							{data.alkes.hscode.income_tax_api} <span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
							PPH &#40;Non-API&#41;
						</p>
						<p className="relative mt-1 block text-sm text-primary/85">
							{data.alkes.hscode.income_tax_non_api}
							<span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
				</div>
				<div className="col-span-12 space-y-4 xl:col-span-3">
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Tanggal AKL</p>
						<p className="mt-1 text-sm text-primary/85">
							{new Date(String(data.alkes.creation_date)).toLocaleDateString('id')}
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
							Tanggal kadaluarsa AKL
						</p>
						<p className="mt-1 text-sm text-primary/85">
							{new Date(String(data.alkes.expiry_date)).toLocaleDateString('id')}
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Fasilitas</p>
						<p className="mt-1 text-sm text-primary/85">{data.facility !== null ? data.facility : '-'}</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Lartas</p>
						<p className="mt-1 text-sm text-primary/85">
							{data.alkes.hscode.lartas !== null ? data.alkes.hscode.lartas : '-'}
						</p>
					</div>
				</div>
			</div>
			<div className="flex flex-row border-t border-primary/15 px-6 py-4 shadow-lg">
				<Button variant="destructive" onClick={() => deleteAlkesItem(row.id)}>
					Hapus
				</Button>
			</div>
		</React.Fragment>
	)
}

export default function SearchAlkesTable() {
	const alkesItems = useAlkesItems()

	const columnHelper = createColumnHelper<AlkesItemsByTypeWithCountriesAndHscode[number]>()
	const columns = useMemo(
		() => [
			columnHelper.accessor('type', {
				id: 'alkes-item-type',
				header: () => <DataTableColumnHeader title="Tipe" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden md:table-cell pr-0',
					rowClassName: 'hidden md:table-cell pr-0',
				},
			}),
			columnHelper.accessor('name', {
				id: 'alkes-item-name',
				header: () => <DataTableColumnHeader title="Deskripsi" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
			}),
			columnHelper.accessor((row) => `${row.alkes.countries.name} / ${row.alkes.countries.code}`, {
				id: 'alkes-item-country',
				header: () => <DataTableColumnHeader title="Negara" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell',
				},
			}),
			columnHelper.accessor('alkes.expiry_date', {
				id: 'alkes-item-status',
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
			columnHelper.display({
				id: 'alkes-item-details',
				header: () => <DataTableColumnHeader title="Details" />,
				cell: () => (
					<CollapsibleTrigger asChild>
						<Button variant="outline" size="icon" className="rounded-full">
							<Icons.chevronDown className="size-4 text-primary" />
							<span className="sr-only">Open row details</span>
						</Button>
					</CollapsibleTrigger>
				),
				meta: {
					headerClassName: 'pl-0',
					rowClassName: 'pl-0',
				},
			}),
		],
		[columnHelper],
	)

	const { table } = useDataTable({
		data: alkesItems,
		columns,
		getRowId: (row) => row.id,
		autoResetAll: false,
	})

	return (
		<DataTable
			table={table}
			stickyHeader={true}
			emptyDataText="Belum ada izin alkes yang terpilih"
			renderRowDetails={(row) => <SearchAlkesRowDetail row={row} />}
		/>
	)
}
