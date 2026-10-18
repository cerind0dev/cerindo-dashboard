import { format, parse } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { extractTextItems, getDocumentProxy } from 'unpdf'

import { HSCODE, INVOICE_COORDINATES, PACKING_LIST_COORDINATES } from './nokia-data'

import type { StructuredTextItem } from 'unpdf'
import type { BoundingBox, NokiaShipment } from './nokia.types'

const extractTextInBox = (pageItems: StructuredTextItem[], box: BoundingBox) => {
	return pageItems
		.filter((item) => {
			return item.x >= box.x && item.x <= box.x + box.w && item.y >= box.y && item.y <= box.y + box.h
		})
		.map((item) => item.str)
		.join(' ')
		.trim()
}

export async function processHungaryShipment(file: File): Promise<NokiaShipment[]> {
	if (file.type !== 'application/pdf') {
		throw new Error('Hungary processing requires a PDF file')
	}

	const arrayBuffer = await file.arrayBuffer()
	const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer))
	const result = await extractTextItems(pdf)

	const totalPages = result.totalPages

	if (totalPages % 2 !== 0) {
		throw new Error(
			`Invalid page count (${totalPages} pages). The PDF must have an even number of pages (alternating invoice and packing list pages)`,
		)
	}

	const allPagesItems = result.items
	const results: NokiaShipment[] = []

	for (let i = 0; i < totalPages; i += 2) {
		const invoicePageItems = allPagesItems[i] || []
		const packingPageItems = allPagesItems[i + 1] || []

		const flatItem = Object.fromEntries([
			...INVOICE_COORDINATES.map((coordinate) => [coordinate.id, extractTextInBox(invoicePageItems, coordinate)]),
			...PACKING_LIST_COORDINATES.map((coordinate) => [coordinate.id, extractTextInBox(packingPageItems, coordinate)]),
		]) as NokiaShipment

		results.push(flatItem)
	}

	return results
}

export async function processThailandShipment(file: File): Promise<NokiaShipment[]> {
	throw new Error('Processing functionality for Thailand shipments is not yet implemented')
}

export async function processIndiaShipment(file: File): Promise<NokiaShipment[]> {
	throw new Error('Processing functionality for Thailand shipments is not yet implemented')
}

export function normalizeShipment(shipment: NokiaShipment) {
	return {
		...shipment,
		invoiceNumber: shipment.invoiceNumber.replace(/^INVOICE\s+/i, '').trim(),
		invoiceDate: format(
			parse(shipment.invoiceDate.trim(), 'MMM d, yyyy', new Date(), {
				locale: enUS,
			}),
			'dd-MM-yyyy',
		),
		netWeight: shipment.netWeight.replace(/\s*KG\s*$/i, '').trim(),
		grossWeight: shipment.grossWeight.replace(/\s*KG\s*$/i, '').trim(),
		description: shipment.description
			.replace(/\b1\s+PC\b/i, '')
			.replace(/\s+/g, ' ')
			.trim(),
		hscode: HSCODE[shipment.hscode.trim()] ?? shipment.hscode.trim(),
	}
}

export const mapShipmentToExcelRow = (item: NokiaShipment, index: number) => ({
	number: index + 1,
	invoiceNumber: item.invoiceNumber,
	invoiceDate: item.invoiceDate,
	netWeight: Math.trunc(parseFloat(item.netWeight.replace(/,/g, '').trim()) * 100) / 100,
	grossWeight: Math.trunc(parseFloat(item.grossWeight.replace(/,/g, '').trim()) * 100) / 100,
	countryOrigin: item.countryOrigin,
	description: item.description.toLocaleUpperCase(),
	hscode: item.hscode,
	quantity: parseInt(item.quantity),
	repairCharge: Math.trunc(parseFloat(item.repairCharge.replace(/,/g, '').trim()) * 100) / 100,
	netTotalPrice: Math.trunc(parseFloat(item.repairCharge.replace(/,/g, '').trim()) * 100) / 100,
	numberSerialLeft: item.numberSerialLeft,
	numberSerialRight: item.numberSerialRight,
	serialNumberDiff: item.numberSerialLeft === item.numberSerialRight ? 'SAMA' : 'TIDAK SAMA',
})

export async function processShipmentByCountry(country: string, file: File) {
	let shipments: NokiaShipment[]

	switch (country) {
		case 'hungary': {
			shipments = await processHungaryShipment(file)
			break
		}
		case 'india': {
			shipments = await processIndiaShipment(file)
			break
		}
		case 'thailand': {
			shipments = await processThailandShipment(file)
			break
		}
		default:
			throw new Error(`Unsupported or unrecognized shipper country of origin: "${country}"`)
	}

	const normalizedShipments = shipments.map(normalizeShipment)

	if (country === 'hungary') {
		normalizedShipments.sort((a, b) =>
			a.invoiceNumber.localeCompare(b.invoiceNumber, 'en', {
				numeric: true,
			}),
		)
	}

	return normalizedShipments
}
