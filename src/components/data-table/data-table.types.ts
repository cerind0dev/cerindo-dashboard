import React from 'react'

import type { DataTableConfig } from '@/config/data-table'
import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string
		placeholder?: string
		variant?: FilterVariant
		options?: Option[]
		icon?: React.FC<React.SVGProps<SVGSVGElement>>
		headerClassName?: string
		rowClassName?: string
	}
}

export interface Option {
	label: string
	value: string
	icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

export type FilterVariant = DataTableConfig['filterVariants'][number]
