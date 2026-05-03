'use client'

import React from 'react'

import { cn } from '@/lib/utils/utils'

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Column } from '@tanstack/react-table'

interface DataTableColumnHeaderProps<TData, TValue> extends React.ComponentProps<'span'> {
	column?: Column<TData, TValue>
	title: string
}

export default function DataTableColumnHeader<TData, TValue>({
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
