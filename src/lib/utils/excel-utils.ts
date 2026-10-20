// @see https://github.com/dadamssg/react-use-exceljs/tree/main

/* eslint-disable @typescript-eslint/no-explicit-any */

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

import type { Workbook, Worksheet } from 'exceljs'

export type Sheet = { name: string; columns: Worksheet['columns'] }
export type InterceptFn = (workbook: Workbook) => Workbook | void
export type Filename = `${string}.xlsx`
export type WorksheetName<T extends Array<Sheet>> = T[number]['name']
export type Data<T extends Array<Sheet>> = Array<any> | Record<WorksheetName<T>, Array<any>>

function cellToString(value: ExcelJS.CellValue): string {
	if (value == null) return ''

	if (value instanceof Date) {
		return value.toISOString().slice(0, 10)
	}

	if (typeof value === 'object') {
		if ('richText' in value && Array.isArray(value.richText)) {
			return value.richText.map((part) => part.text).join('')
		}

		if ('text' in value && typeof value.text === 'string') {
			return value.text
		}

		if ('result' in value) {
			return cellToString(value.result as ExcelJS.CellValue)
		}
	}

	return String(value)
}

async function makeBuffer<T extends Array<Sheet>>({
	worksheets,
	data,
	intercept,
}: {
	worksheets: T
	data: Array<any> | Record<T[number]['name'], Array<any>>
	intercept?: InterceptFn
}) {
	let workbook = new ExcelJS.Workbook()

	for (const worksheet of worksheets) {
		const sheet = workbook.addWorksheet(worksheet.name)
		sheet.columns = worksheet.columns

		const rows = (Array.isArray(data) ? data : data[worksheet.name as T[number]['name']]) ?? []
		sheet.addRows(rows)
	}

	workbook = intercept ? (intercept(workbook) ?? workbook) : workbook

	return await workbook.xlsx.writeBuffer()
}

async function downloadExcelJS<T extends Array<Sheet>>({
	filename,
	data,
	worksheets,
	intercept,
}: {
	worksheets: T
	data: Data<T>
	filename?: Filename
	intercept?: InterceptFn
}) {
	const buffer = await makeBuffer({ worksheets, data, intercept })
	const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	const blob = new Blob([buffer], { type: fileType })

	saveAs(blob, filename ?? 'workbook.xlsx')
}

export { cellToString, downloadExcelJS }
