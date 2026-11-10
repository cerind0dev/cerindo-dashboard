import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	metaHelper,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures,
} from '@tanstack/react-table'

import type { DataTableColumnMeta } from './data-table.types'

export const dataTableFeatures = tableFeatures({
	columnFilteringFeature,
	rowPaginationFeature,
	columnVisibilityFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	columnMeta: metaHelper<DataTableColumnMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures
