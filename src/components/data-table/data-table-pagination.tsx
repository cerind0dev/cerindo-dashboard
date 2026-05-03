'use client'

import React from 'react'

import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'

import type { Table } from '@tanstack/react-table'

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
	table: Table<TData>
}

export default function DataTablePagination<TData>({ table, className, ...props }: DataTablePaginationProps<TData>) {
	return (
		<div className={cn('flex items-center space-x-4', className)} {...props}>
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
