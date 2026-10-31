import { INVOICE_COORDINATES, PACKING_LIST_COORDINATES } from './nokia-data'

export type BoundingBox = {
	id: string
	x: number
	y: number
	w: number
	h: number
}

export type NokiaShipmentField =
	| (typeof INVOICE_COORDINATES)[number]['id']
	| (typeof PACKING_LIST_COORDINATES)[number]['id']

export type ShipmentDirection = 'import' | 'export'

export type NokiaShipment = Record<NokiaShipmentField, string>
