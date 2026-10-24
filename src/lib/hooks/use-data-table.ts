'use client'

import React, { useMemo, useState } from 'react'

import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import type { ColumnFiltersState, PaginationState, TableOptions } from '@tanstack/react-table'

export default function useDataTable<TData>(
	props: Omit<TableOptions<TData>, 'state' | 'pageCount' | 'getCoreRowModel'>,
) {
	const { columns, ...tableProps } = props

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 15,
	})

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const table = useReactTable({
		...tableProps,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: setPagination,
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			pagination,
			columnFilters,
		},
		meta: {
			...tableProps.meta,
		},
	})

	return useMemo(() => ({ table }), [table])
}
