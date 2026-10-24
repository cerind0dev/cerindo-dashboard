import { format, parse } from 'date-fns'
import { enUS } from 'date-fns/locale'
import ExcelJS from 'exceljs'
import { extractTextItems, getDocumentProxy } from 'unpdf'

import { cellToString } from '@/lib/utils/excel-utils'
import { roundToTwoDecimals } from '@/lib/utils/utils'

import { COUNTRY_OF_ORIGIN, HSCODE, INVOICE_COORDINATES, PACKING_LIST_COORDINATES } from './nokia-data'

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

export async function processIndiaShipment(file: File, totalDataRows: number): Promise<NokiaShipment[]> {
	if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
		throw new Error('India processing requires a .xlsx file')
	}

	if (!Number.isInteger(totalDataRows) || totalDataRows < 1) {
		throw new Error('The total number of data rows must be a positive integer.')
	}

	const invoiceFirstRow = 21 // starts at row number 21
	const invoiceLastRow = invoiceFirstRow + totalDataRows - 1

	let packingListFirstRow = 2 // starts at row number 2
	const packingListTargetRows = totalDataRows ?? 0

	const workbook = new ExcelJS.Workbook()

	await workbook.xlsx.load(await file.arrayBuffer())

	const invoiceWorksheet = workbook.getWorksheet('INVOICE-Final')
	const packingListWorksheet = workbook.getWorksheet('Master Packing List')

	if (!invoiceWorksheet || !packingListWorksheet) {
		throw new Error("Required sheets ('INVOICE-Final' or 'Master Packing List') not found.")
	}

	if (invoiceLastRow > invoiceWorksheet.rowCount) {
		throw new Error(
			`The requested final row is ${invoiceLastRow}, but the worksheet contains only ${invoiceWorksheet.rowCount} rows.`,
		)
	}

	const results: NokiaShipment[] = []

	for (let rowNumber = invoiceFirstRow; rowNumber <= invoiceLastRow; rowNumber++) {
		const row = invoiceWorksheet.getRow(rowNumber)

		const invoiceNumber = `${invoiceWorksheet.getRow(8).getCell(9).value}_${cellToString(row.getCell(5).value)}`
		const invoiceDate = invoiceWorksheet.getRow(7).getCell(9).value

		results.push({
			invoiceNumber: cellToString(invoiceNumber),
			invoiceDate: cellToString(invoiceDate),
			description: cellToString(row.getCell(2).value),
			quantity: cellToString(row.getCell(4).value),
			numberSerialLeft: cellToString(row.getCell(5).value),
			numberSerialRight: cellToString(row.getCell(5).value),
			countryOrigin: cellToString(row.getCell(8).value),
			hscode: cellToString(row.getCell(9).value),
			repairCharge: cellToString(row.getCell(10).value),
			netTotalPrice: cellToString(row.getCell(10).value),
			netWeight: '',
			grossWeight: '',
		})
	}

	const resultsPackingList: { serialNumber: string; netWeight: string; grossWeight: string }[] = []

	while (resultsPackingList.length < packingListTargetRows && packingListFirstRow <= packingListWorksheet.rowCount) {
		const row = packingListWorksheet.getRow(packingListFirstRow)

		const description = row.getCell(1).value // column A

		/*
		 * DOCS: if we already found an empty cell in column A,
		 * we can skip the other column and consider this row as empty
		 */
		if (description === null || description === undefined || description === '') {
			packingListFirstRow++
			continue
		}

		const serialNumber = cellToString(row.getCell(4).value)
		const netWeight = cellToString(row.getCell(6).value)
		const grossWeight = cellToString(row.getCell(7).value)

		resultsPackingList.push({
			serialNumber,
			netWeight,
			grossWeight,
		})

		packingListFirstRow++
	}

	/*
	 * DOCS: sort the net weight values found in the packing list sheet based on serial number
	 */
	const packingListMap = new Map<string, (typeof resultsPackingList)[number]>()

	for (const item of resultsPackingList) {
		const serialNumber = item.serialNumber.trim()

		if (serialNumber) {
			packingListMap.set(serialNumber, item)
		}
	}

	const mergedData: NokiaShipment[] = results.map((invoiceItem) => {
		const matchedPackingList = packingListMap.get(invoiceItem.numberSerialLeft.trim())

		return {
			...invoiceItem,
			netWeight: matchedPackingList?.netWeight ?? invoiceItem.netWeight,
			grossWeight: matchedPackingList?.grossWeight ?? invoiceItem.grossWeight,
		}
	})

	/*
	 * DOCS: the net weight in the header could differs from the total net weight in the packing list
	 * we find the difference, if found then add the difference to the first item
	 */
	const totalNetWeight = mergedData.reduce((total, item) => {
		const cleanedWeight = roundToTwoDecimals(item.netWeight)

		if (!Number.isFinite(cleanedWeight)) {
			throw new Error(`Invalid net weight for serial number "${item.numberSerialLeft}": "${item.netWeight}"`)
		}

		return total + cleanedWeight
	}, 0)

	const netWeightOnHeader = roundToTwoDecimals(cellToString(invoiceWorksheet.getRow(12).getCell(9).value))
	const netWeightDifference = netWeightOnHeader - totalNetWeight

	if (netWeightDifference !== 0) {
		const adjustedWeightUnits = roundToTwoDecimals(mergedData[0].netWeight) + netWeightDifference

		if (adjustedWeightUnits < 0) {
			throw new Error('Net weight reconciliation would make the first item’s weight negative.')
		}

		mergedData[0] = {
			...mergedData[0],
			netWeight: String(adjustedWeightUnits), // need to convert back to string to match return type
		}
	}

	return mergedData
}

export function normalizeShipment(shipment: NokiaShipment, invoiceDateFormat: string) {
	return {
		...shipment,
		invoiceNumber: shipment.invoiceNumber.replace(/^INVOICE\s+/i, '').trim(),
		invoiceDate: format(
			parse(shipment.invoiceDate.trim(), invoiceDateFormat, new Date(), {
				locale: enUS,
			}),
			'dd-MM-yyyy',
		),
		netWeight: shipment.netWeight.replace(/\s*KG\s*$/i, '').trim(),
		grossWeight: shipment.grossWeight.replace(/\s*KG\s*$/i, '').trim(),
		countryOrigin: COUNTRY_OF_ORIGIN[shipment.countryOrigin.trim()] ?? shipment.countryOrigin.trim(),
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
	netWeight: roundToTwoDecimals(item.netWeight),
	grossWeight: roundToTwoDecimals(item.grossWeight),
	countryOrigin: item.countryOrigin,
	description: `${item.description}, SERIAL NO : ${item.numberSerialLeft}`.toUpperCase(),
	hscode: item.hscode,
	quantity: parseInt(item.quantity),
	repairCharge: roundToTwoDecimals(item.repairCharge),
	netTotalPrice: roundToTwoDecimals(item.netTotalPrice),
	numberSerialLeft: item.numberSerialLeft,
	numberSerialRight: item.numberSerialRight,
	serialNumberDiff: item.numberSerialLeft === item.numberSerialRight ? 'SAMA' : 'TIDAK SAMA',
})

export async function processShipmentByCountry(country: string, file: File, totalDataRows: number) {
	let shipments: NokiaShipment[]
	let invoiceDateFormat: string

	switch (country) {
		case 'hungary': {
			shipments = await processHungaryShipment(file)
			invoiceDateFormat = 'MMM d, yyyy'
			break
		}
		case 'india': {
			shipments = await processIndiaShipment(file, totalDataRows)
			invoiceDateFormat = 'yyyy-M-d'
			break
		}
		case 'thailand': {
			shipments = await processThailandShipment(file)
			break
		}
		default:
			throw new Error(`Unsupported or unrecognized shipper country of origin: "${country}"`)
	}

	const normalizedShipments = shipments.map((shipment) => normalizeShipment(shipment, invoiceDateFormat))

	if (country === 'hungary') {
		normalizedShipments.sort((a, b) =>
			a.invoiceNumber.localeCompare(b.invoiceNumber, 'en', {
				numeric: true,
			}),
		)
	}

	return normalizedShipments
}
