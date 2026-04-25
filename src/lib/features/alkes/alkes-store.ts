import { saveAs } from 'file-saver'
import { createStore } from 'zustand'

import { ALKES_WORKSHEETS, mapAlkesToExcelRow } from '@/lib/features/alkes/utils'
import { downloadExcelJS } from '@/lib/utils/excel-utils'
import { formatDate } from '@/lib/utils/utils'

import type { Alkes, AlkesItemsByTypeWithCountriesAndHscode } from '@/lib/features/alkes/alkes.types'

export type AlkesState = {
	alkesItems: AlkesItemsByTypeWithCountriesAndHscode[number][]
}

/**
 * TODO: add reorderAlkesItem action
 */

export type AlkesActions = {
	addAlkesItem: (item: AlkesItemsByTypeWithCountriesAndHscode[number]) => void
	deleteAlkesItem: (id: string) => void
	exportAlkesToZip: (
		origin: string,
		alkes: Pick<Alkes, 'id' | 'creation_date' | 'expiry_date' | 'file_url'>[],
	) => Promise<void>
	exportAlkesToExcel: (alkesItems: AlkesItemsByTypeWithCountriesAndHscode[number][]) => Promise<void>
	clearAllAlkesItems: () => void
}

export type AlkesStore = AlkesState & { actions: AlkesActions }

export const defaultInitialState: AlkesState = {
	alkesItems: [],
}

export const createAlkesStore = (initialState: AlkesState = defaultInitialState) => {
	return createStore<AlkesStore>()((set) => ({
		...initialState,
		actions: {
			addAlkesItem: (item) =>
				set((state) => {
					return {
						alkesItems: [...state.alkesItems, { ...item }],
					}
				}),
			deleteAlkesItem: (id) =>
				set((state) => ({
					alkesItems: state.alkesItems.filter((item) => item.id !== id),
				})),
			exportAlkesToZip: async (origin, alkes) => {
				if (alkes.length === 0) {
					throw new Error('Daftar alkes kosong')
				}

				const payload = alkes.map((item) => ({
					id: item.id,
					file_url: item.file_url,
				}))

				const response = await fetch(`${origin}/serve-file`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ alkesFiles: payload }),
				})

				if (!response.ok) {
					const errorData = await response.json()
					throw new Error(errorData.error || errorData.message || 'Gagal membuat ZIP')
				}

				const blob = await response.blob()
				saveAs(blob, `alkes-export-${formatDate(new Date())}.zip`)
			},
			exportAlkesToExcel: async (alkesItems) => {
				if (alkesItems.length === 0) throw new Error('Daftar alkes kosong')

				const dataToExport = alkesItems.map(mapAlkesToExcelRow)

				await downloadExcelJS({
					filename: `alkes-export-${formatDate(new Date())}.xlsx`,
					worksheets: ALKES_WORKSHEETS,
					data: dataToExport,
				})
			},
			clearAllAlkesItems: () => set(initialState),
		},
	}))
}
