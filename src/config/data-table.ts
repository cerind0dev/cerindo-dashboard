export const dataTableConfig = {
	filterVariants: ['text', 'number', 'range', 'date', 'dateRange', 'boolean', 'select', 'multiSelect'] as const,
}

export type DataTableConfig = typeof dataTableConfig
