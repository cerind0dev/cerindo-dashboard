import React from 'react'

import type { DataTableConfig } from '@/config/data-table'

export interface DataTableColumnMeta {
	label?: string
	placeholder?: string
	variant?: FilterVariant
	options?: Option[]
	range?: [number, number]
	unit?: string
	icon?: React.ComponentType<React.ComponentProps<'svg'>>
	headerClassName?: string
	rowClassName?: string
}

export interface Option {
	label: string
	value: string
	count?: number
	icon?: React.ComponentType<React.ComponentProps<'svg'>>
}

export type FilterVariant = DataTableConfig['filterVariants'][number]
