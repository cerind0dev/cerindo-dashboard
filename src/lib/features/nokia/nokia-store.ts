import { createStore } from 'zustand'

import { downloadExcelJS } from '@/lib/utils/excel-utils'
import { formatDate } from '@/lib/utils/utils'

import { NOKIA_SHIPMENT_WORKSHEETS } from './nokia-data'
import { mapShipmentToExcelRow, processShipmentByCountry } from './utils'

import type { NokiaShipment } from './nokia.types'

export type NokiaState = {
	nokiaShipment: NokiaShipment[]
}

export type NokiaActions = {
	processShipment: (country: string, file: File) => Promise<void>
	exportShipmentToExcel: (shipment: NokiaShipment[]) => Promise<void>
	clearAll: () => void
}

export type NokiaStore = NokiaState & { actions: NokiaActions }

export const defaultInitialState: NokiaState = {
	nokiaShipment: [],
}

export const createNokiaStore = (initialState: NokiaState = defaultInitialState) => {
	return createStore<NokiaStore>()((set) => ({
		...initialState,
		actions: {
			processShipment: async (country, file) => {
				const results = await processShipmentByCountry(country, file)

				set({
					nokiaShipment: results,
				})
			},
			exportShipmentToExcel: async (shipment) => {
				if (shipment.length === 0) throw new Error('Data shipment masih kosong')

				const dataToExport = shipment.map(mapShipmentToExcelRow)

				await downloadExcelJS({
					filename: `nokia-export-${formatDate(new Date())}.xlsx`,
					worksheets: NOKIA_SHIPMENT_WORKSHEETS,
					data: dataToExport,
				})
			},
			clearAll: () => set(initialState),
		},
	}))
}
