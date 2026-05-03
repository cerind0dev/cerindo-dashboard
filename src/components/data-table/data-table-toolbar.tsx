'use client'

import React, { useCallback, useMemo } from 'react'

import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import type { Column, Table } from '@tanstack/react-table'

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
	table: Table<TData>
}

export default function DataTableToolbar<TData>({
	table,
	children,
	className,
	...props
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0

	const columns = useMemo(() => {
		return table.getAllColumns().filter((column) => column.getCanFilter())
	}, [table])

	const onReset = useCallback(() => {
		table.resetColumnFilters()
	}, [table])

	return (
		<div
			role="toolbar"
			aria-orientation="horizontal"
			className={cn('flex w-full items-start justify-between gap-2 p-1', className)}
			{...props}
		>
			<div className="flex flex-1 flex-wrap items-center gap-2">
				{columns.map((column) => (
					<DataTableToolbarFilter key={column.id} column={column} />
				))}
				{isFiltered && (
					<Button aria-label="Reset filters" variant="outline" size="sm" className="border-dashed" onClick={onReset}>
						<Icons.x />
						Reset
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	)
}

interface DataTableToolbarFilterProps<TData> {
	column: Column<TData>
}

function DataTableToolbarFilter<TData>({ column }: DataTableToolbarFilterProps<TData>) {
	const columnMeta = column.columnDef.meta

	const onFilterRender = useCallback(() => {
		if (!columnMeta?.variant) return null

		switch (columnMeta.variant) {
			case 'text': {
				return (
					<Input
						placeholder={columnMeta.placeholder ?? columnMeta.label}
						value={(column.getFilterValue() as string) ?? ''}
						onChange={(event) => column.setFilterValue(event.target.value)}
						className="h-8 w-full bg-white lg:w-80"
					/>
				)
			}
			default: {
				return null
			}
		}
	}, [column, columnMeta])

	return onFilterRender()
}
