'use client'

import React, { useMemo } from 'react'

import { createColumnHelper, flexRender, getCoreRowModel, Row, RowData, useReactTable } from '@tanstack/react-table'

import { useAlkesActions, useAlkesItems } from '@/lib/features/alkes/alkes-store-provider'
import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { AlkesItem } from '@/lib/features/alkes/alkes.types'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		headerClassName?: string
		rowClassName?: string
	}
}

export default function AlkesTable() {
	const alkesItems = useAlkesItems()
	const { deleteAlkesItem } = useAlkesActions()

	const columnHelper = createColumnHelper<AlkesItem>()
	const columns = useMemo(
		() => [
			columnHelper.accessor('type', {
				id: 'alkes-type',
				header: 'Tipe',
				cell: ({ row }) => {
					return <span>{row.original.type}</span>
				},
				meta: {
					headerClassName: 'hidden md:table-cell pr-0',
					rowClassName: 'hidden md:table-cell pr-0',
				},
			}),
			columnHelper.accessor('name', {
				id: 'alkes-name',
				header: 'Deskripsi',
				cell: ({ row }) => {
					return <span>{row.original.name}</span>
				},
			}),
			columnHelper.accessor('alkes.countries', {
				id: 'alkes-country',
				header: 'Negara',
				cell: ({ row }) => {
					return <span>{`${row.original.alkes.countries.name} (${row.original.alkes.countries.code})`}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell',
				},
			}),
			columnHelper.accessor('alkes.expiry_date', {
				id: 'alkes-status',
				header: 'Status',
				cell: ({ row }) => (
					<span
						className={cn(
							'inline-flex flex-row items-center gap-x-1 rounded-full px-2 py-0.5',
							new Date(row.original.alkes.expiry_date) < new Date()
								? 'bg-red-100 text-red-600'
								: 'bg-green-100 text-green-600',
						)}
					>
						{new Date(row.original.alkes.expiry_date) < new Date() ? (
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
				id: 'details',
				header: 'Details',
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

	const table = useReactTable({
		data: alkesItems,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.id,
		autoResetAll: false,
	})

	return (
		<div className="flex max-w-full flex-auto flex-col overflow-auto">
			<Table className="min-w-full">
				<TableHeader className="sticky top-0 z-10 w-full shadow-sm">
					{table.getHeaderGroups().map((headerGroup) => {
						return (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											scope="col"
											colSpan={header.colSpan}
											className={cn(
												"relative bg-muted px-4 py-3 text-left text-[13px] font-semibold whitespace-nowrap text-slate-700 before:absolute before:top-0 before:left-0 before:w-full before:border-t before:border-border before:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-border after:content-['']",
												header.column.columnDef.meta?.headerClassName ?? '',
											)}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						)
					})}
				</TableHeader>
				{alkesItems.length === 0 ? (
					<TableBody>
						<TableRow>
							<TableCell colSpan={6}>
								<div className="m-6 rounded border-2 border-dashed border-slate-300 py-4 text-center">
									<p className="text-sm font-medium">Anda belum memilih izin AKL</p>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				) : (
					<TableBody className="w-full overflow-y-auto">
						{table.getRowModel().rows.map((row) => {
							return (
								<Collapsible key={row.id} asChild>
									<React.Fragment>
										<TableRow className="border-b border-border last:border-b-0">
											{row.getVisibleCells().map((cell) => {
												return (
													<TableCell
														key={cell.id}
														className={cn(
															'px-4 py-2 text-left text-sm tracking-normal whitespace-nowrap text-slate-700 uppercase',
															cell.column.columnDef.meta?.rowClassName ?? '',
														)}
													>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												)
											})}
										</TableRow>
										<CollapsibleContent asChild>
											<TableRow>
												<TableCell colSpan={6} className="p-0">
													<div className="grid grid-cols-12 gap-5 px-6 py-8">
														<div className="col-span-12 space-y-4 xl:col-span-6">
															<div className="grid grid-cols-4 gap-4">
																<div className="col-span-4 rounded border border-slate-300 px-2.5 py-2 shadow sm:col-span-2">
																	<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																		Kode AKL
																	</p>
																	<p className="mt-1 text-sm text-slate-700">
																		{row.original.alkes.id.split('_').join(' ')}
																	</p>
																</div>
																<div className="col-span-4 rounded border border-slate-300 px-2.5 py-2 shadow sm:col-span-1">
																	<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																		Tipe
																	</p>
																	<p className="mt-1 text-sm text-slate-700">{row.original.type}</p>
																</div>
																<div className="col-span-4 rounded border border-slate-300 px-2.5 py-2 shadow sm:col-span-1">
																	<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																		HS Code
																	</p>
																	<p className="mt-1 text-sm text-slate-700">{row.original.alkes.hscode.code}</p>
																</div>
															</div>
															<div className="grid grid-cols-2 gap-4">
																<div className="col-span-2 rounded border border-slate-300 px-2.5 py-2 shadow sm:col-span-1">
																	<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																		Merek
																	</p>
																	<p className="mt-1 truncate text-sm text-slate-700">
																		{row.original.alkes.brand_name}
																	</p>
																</div>
																<div className="col-span-2 rounded border border-slate-300 px-2.5 py-2 shadow sm:col-span-1">
																	<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																		Kemasan
																	</p>
																	<p className="mt-1 truncate text-sm text-slate-700">{row.original.alkes.packaging}</p>
																</div>
															</div>
															<div className="grid grid-cols-2 gap-4">
																<div className="col-span-2 rounded border border-slate-300 px-2.5 py-2 shadow sm:col-span-1">
																	<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																		Negara asal
																	</p>
																	<p className="mt-1 text-sm text-slate-700">{row.original.alkes.countries.name}</p>
																</div>
																<div className="col-span-2 rounded border border-slate-300 px-2.5 py-2 shadow sm:col-span-1">
																	<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																		Kode negara asal
																	</p>
																	<p className="mt-1 text-sm text-slate-700">{row.original.alkes.countries.code}</p>
																</div>
															</div>
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	Deskripsi
																</p>
																<p className="mt-1 truncate text-sm text-slate-700">
																	{row.original.name !== null ? row.original.name : '-'}
																</p>
															</div>
														</div>
														<div className="col-span-12 space-y-4 xl:col-span-3">
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	Biaya masuk
																</p>
																<p className="relative mt-1 text-sm text-slate-700">
																	{row.original.alkes.hscode.import_dutyfees}
																	<span className="absolute right-0 text-slate-400">&#37;</span>
																</p>
															</div>
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	PPN
																</p>
																<p className="relative mt-1 text-sm text-slate-700">
																	{row.original.alkes.hscode.value_added_tax}
																	<span className="absolute right-0 text-slate-400">&#37;</span>
																</p>
															</div>
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	PPH &#40;API&#41;
																</p>
																<p className="relative mt-1 text-sm text-slate-700">
																	{row.original.alkes.hscode.income_tax_api}{' '}
																	<span className="absolute right-0 text-slate-400">&#37;</span>
																</p>
															</div>
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	PPH &#40;Non-API&#41;
																</p>
																<p className="relative mt-1 block text-sm text-slate-700">
																	{row.original.alkes.hscode.income_tax_non_api}
																	<span className="absolute right-0 text-slate-400">&#37;</span>
																</p>
															</div>
														</div>
														<div className="col-span-12 space-y-4 xl:col-span-3">
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	Tanggal AKL
																</p>
																<p className="mt-1 text-sm text-slate-700">
																	{new Date(String(row.original.alkes.creation_date)).toLocaleDateString('id')}
																</p>
															</div>
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	Tanggal kadaluarsa AKL
																</p>
																<p className="mt-1 text-sm text-slate-700">
																	{new Date(String(row.original.alkes.expiry_date)).toLocaleDateString('id')}
																</p>
															</div>
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	Fasilitas
																</p>
																<p className="mt-1 text-sm text-slate-700">
																	{row.original.facility !== null ? row.original.facility : '-'}
																</p>
															</div>
															<div className="rounded border border-slate-300 px-2.5 py-2 shadow">
																<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-slate-700">
																	Lartas
																</p>
																<p className="mt-1 text-sm text-slate-700">
																	{row.original.alkes.hscode.lartas !== null ? row.original.alkes.hscode.lartas : '-'}
																</p>
															</div>
														</div>
													</div>
													<div className="flex flex-row border-t border-slate-300 px-6 py-4 shadow-lg">
														<Button variant="destructive" onClick={() => deleteAlkesItem(row.id)}>
															Hapus
														</Button>
													</div>
												</TableCell>
											</TableRow>
										</CollapsibleContent>
									</React.Fragment>
								</Collapsible>
							)
						})}
					</TableBody>
				)}
			</Table>
		</div>
	)
}
