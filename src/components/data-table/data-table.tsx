'use client'

import React, { useState } from 'react'

import { flexRender } from '@tanstack/react-table'

import { cn } from '@/lib/utils/utils'

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import DataTablePagination from './data-table-pagination'

import type { Row, Table as TanstackTable } from '@tanstack/react-table'

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
	className?: string
	table: TanstackTable<TData>
	stickyHeader: boolean
	emptyDataText: string
	renderRowDetails?: (row: Row<TData>) => React.ReactNode
}

export function DataTable<TData>({
	table,
	className,
	children,
	stickyHeader = false,
	emptyDataText,
	renderRowDetails,
	...props
}: DataTableProps<TData>) {
	const [openItem, setOpenItem] = useState<string | null>(null)

	return (
		<div className={cn(className, 'flex max-w-full flex-auto flex-col overflow-auto')} {...props}>
			{children}
			<Table>
				<TableHeader className={cn(stickyHeader && 'sticky top-0 z-10', 'shadow-sm [&_tr]:border-b-0')}>
					{table.options.getPaginationRowModel !== undefined && (
						<TableRow className="relative border-b-0">
							<TableCell
								scope="col"
								colSpan={table.getAllColumns().length}
								className="bg-white px-6 py-3 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-border after:content-['']"
							>
								<DataTablePagination table={table} />
							</TableCell>
						</TableRow>
					)}
					{table.getHeaderGroups().map((headerGroup) => {
						return (
							<TableRow key={headerGroup.id} className="border-b-0">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											scope="col"
											colSpan={header.colSpan}
											className={cn(
												'relative bg-muted px-4 py-3',
												header.column.columnDef.meta?.headerClassName ?? '',
												stickyHeader &&
													"after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-border after:content-['']",
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
				{table.getRowModel().rows.length === 0 ? (
					<TableBody className="w-full overflow-y-auto">
						<TableRow>
							<TableCell colSpan={table.getAllColumns().length}>
								<div className="m-6 rounded border-2 border-dashed border-primary/15 py-4 text-center">
									<p className="text-sm font-medium">{emptyDataText}</p>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				) : (
					table.getRowModel().rows.map((row) => {
						return (
							<Collapsible
								key={row.id}
								open={openItem === row.id}
								onOpenChange={() => setOpenItem((previous) => (previous === row.id ? null : row.id))}
								asChild
							>
								<TableBody className="w-full overflow-y-auto">
									<TableRow>
										{row.getVisibleCells().map((cell) => {
											return (
												<TableCell
													key={cell.id}
													className={cn('px-4 py-2 uppercase', cell.column.columnDef.meta?.rowClassName ?? '')}
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											)
										})}
									</TableRow>
									{renderRowDetails && (
										<CollapsibleContent asChild>
											<TableRow>
												<TableCell colSpan={row.getVisibleCells().length} className="p-0">
													{renderRowDetails(row)}
												</TableCell>
											</TableRow>
										</CollapsibleContent>
									)}
								</TableBody>
							</Collapsible>
						)
					})
				)}
			</Table>
		</div>
	)
}
