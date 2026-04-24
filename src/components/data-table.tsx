'use client'

import React from 'react'

import { flexRender } from '@tanstack/react-table'

import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { Column, Row, RowData, Table as TanstackTable } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		headerClassName?: string
		rowClassName?: string
	}
}

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLSpanElement> {
	column?: Column<TData, TValue>
	title: string
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	return <span className={cn(className)}>{title}</span>
}

interface DataTablePaginationProps<TData> {
	table: TanstackTable<TData>
}

function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
	return (
		<div className="flex items-center space-x-4">
			<p className="text-sm">
				Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
			</p>
			<div className="flex items-center space-x-2">
				<Button
					aria-label="go to previous page"
					variant="outline"
					size="icon"
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}
				>
					<Icons.chevronLeft className="size-4" />
					<span className="sr-only">Go to previous page</span>
				</Button>
				<Button
					aria-label="go to next page"
					variant="outline"
					size="icon"
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}
				>
					<span className="sr-only">Go to next page</span>
					<Icons.chevronRight className="size-4" />
				</Button>
			</div>
		</div>
	)
}

interface DataTableToolbar {
	children: React.ReactNode
}

export function DataTableToolbar({ children }: DataTableToolbar) {
	return <div className="border-t">{children}</div>
}

interface DataTableProps<TData> {
	className?: string
	table: TanstackTable<TData>
	stickyHeader: boolean
	emptyDataText: string
	renderRowDetails?: (row: Row<TData>) => React.ReactNode
}

export function DataTable<TData>({
	className,
	table,
	stickyHeader = false,
	emptyDataText,
	renderRowDetails,
}: DataTableProps<TData>) {
	return (
		<Table className={cn(className)}>
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
			<TableBody className="w-full overflow-y-auto">
				{table.getRowModel().rows.length === 0 ? (
					<TableRow>
						<TableCell colSpan={table.getAllColumns().length}>
							<div className="m-6 rounded border-2 border-dashed border-primary/15 py-4 text-center">
								<p className="text-sm font-medium">{emptyDataText}</p>
							</div>
						</TableCell>
					</TableRow>
				) : (
					table.getRowModel().rows.map((row) => {
						return (
							<Collapsible key={row.id} asChild>
								<React.Fragment>
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
								</React.Fragment>
							</Collapsible>
						)
					})
				)}
			</TableBody>
		</Table>
	)
}
