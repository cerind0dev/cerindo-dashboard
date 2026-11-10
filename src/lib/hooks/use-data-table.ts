'use client'

import React, { useMemo, useState } from 'react'

import { useTable } from '@tanstack/react-table'

import { dataTableFeatures } from '@/components/data-table/data-table-features'

import type { DataTableFeatures } from '@/components/data-table/data-table-features'
import type { ColumnFiltersState, PaginationState, RowData, TableOptions } from '@tanstack/react-table'

export default function useDataTable<TData extends RowData>(
	props: Omit<TableOptions<DataTableFeatures, TData>, 'state' | 'features'>,
) {
	const { columns, ...tableProps } = props

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 15,
	})

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const table = useTable({
		...tableProps,
		features: dataTableFeatures,
		columns,
		state: {
			pagination,
			columnFilters,
		},
		onPaginationChange: setPagination,
		onColumnFiltersChange: setColumnFilters,
		meta: {
			...tableProps.meta,
		},
	})

	return useMemo(() => ({ table }), [table])
}
