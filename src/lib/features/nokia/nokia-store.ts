import { createStore } from 'zustand'

import { downloadExcelJS } from '@/lib/utils/excel-utils'
import { formatDate } from '@/lib/utils/utils'

import { NOKIA_SHIPMENT_WORKSHEETS } from './nokia-data'
import { mapShipmentToExcelRow, processShipment } from './utils'

import type { NokiaShipment, ShipmentDirection } from './nokia.types'

export type NokiaState = {
	nokiaShipment: NokiaShipment[]
}

export type NokiaActions = {
	processShipment: (direction: ShipmentDirection, country: string, file: File, totalDataRows: number) => Promise<void>
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
			processShipment: async (direction, country, file, totalDataRows) => {
				const results = await processShipment(direction, country, file, totalDataRows)

				if (totalDataRows !== results.length) {
					throw new Error('Jumlah item di dalam file terpilih berbeda dengan jumlah barang input')
					return
				}

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
