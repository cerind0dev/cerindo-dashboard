'use client'

import React from 'react'

import { cn } from '@/lib/utils/utils'

import type { Column, RowData } from '@tanstack/react-table'
import type { DataTableFeatures } from './data-table-features'

interface DataTableColumnHeaderProps<TData extends RowData, TValue> extends React.ComponentProps<'span'> {
	column?: Column<DataTableFeatures, TData, TValue>
	title: string
}

export default function DataTableColumnHeader<TData extends RowData, TValue>({
	column,
	title,
	className,
	...props
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column?.getCanSort() && !column?.getCanHide()) {
		return (
			<span className={cn(className)} {...props}>
				{title}
			</span>
		)
	}
}
