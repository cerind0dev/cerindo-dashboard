import type { BoundingBox } from './nokia.types'

export const COUNTRY_OF_ORIGIN: Partial<Record<string, string>> = {
	India: 'IN',
	China: 'CN',
	Vietnam: 'VN',
	Ukraine: 'UA',
	Finland: 'FI',
}

export const HSCODE: Partial<Record<string, string>> = {
	'8517620000': '85176299',
	'85176290': '85176299',
}

export const INVOICE_COORDINATES = [
	{
		id: 'invoiceNumber',
		x: 212,
		y: 793,
		w: 143,
		h: 29,
	},
	{
		id: 'invoiceDate',
		x: 258,
		y: 786,
		w: 54,
		h: 11,
	},
	{
		id: 'netWeight',
		x: 316,
		y: 642,
		w: 78,
		h: 14,
	},
	{
		id: 'grossWeight',
		x: 317,
		y: 630,
		w: 81,
		h: 14,
	},
	{
		id: 'countryOrigin',
		x: 107,
		y: 472,
		w: 16,
		h: 14,
	},
	{
		id: 'description',
		x: 165,
		y: 492,
		w: 266,
		h: 22,
	},
	{
		id: 'hscode',
		x: 163,
		y: 472,
		w: 53,
		h: 11,
	},
	{
		id: 'quantity',
		x: 393,
		y: 500,
		w: 20,
		h: 15,
	},
	{
		id: 'repairCharge',
		x: 440,
		y: 499,
		w: 65,
		h: 17,
	},
	{
		id: 'netTotalPrice',
		x: 517,
		y: 500,
		w: 56,
		h: 14,
	},
] as const satisfies readonly BoundingBox[] // remembering their exact IDs so we can derive shipment properties from them

export const PACKING_LIST_COORDINATES = [
	{
		id: 'numberSerialLeft',
		x: 130,
		y: 245,
		w: 85,
		h: 19,
	},
	{
		id: 'numberSerialRight',
		x: 678,
		y: 240,
		w: 103,
		h: 24,
	},
] as const satisfies readonly BoundingBox[]

export const NOKIA_SHIPMENT_WORKSHEETS = [
	{
		name: 'Shipment',
		columns: [
			{ header: 'NOMOR', key: 'number' },
			{ header: 'NOMOR INVOICE', key: 'invoiceNumber' },
			{ header: 'TANGGAL INVOICE', key: 'invoiceDate' },
			{ header: 'NET WEIGHT', key: 'netWeight' },
			{ header: 'GROSS WEIGHT', key: 'grossWeight' },
			{ header: 'COUNTRY OF ORIGIN', key: 'countryOrigin' },
			{ header: 'DESKRIPSI', key: 'description' },
			{ header: 'HSCODE', key: 'hscode' },
			{ header: 'KUANTITAS', key: 'quantity' },
			{ header: 'REPAIR CHARGE', key: 'repairCharge' },
			{ header: 'NET TOTAL PRICE', key: 'netTotalPrice' },
			{ header: 'SERIAL NUMBER KIRI', key: 'numberSerialLeft' },
			{ header: 'SERIAL NUMBER KANAN', key: 'numberSerialRight' },
			{ header: 'PERBEDAAN SERIAL NUMBER', key: 'serialNumberDiff' },
		],
	},
	{
		name: 'Perhitungan',
		columns: [
			{ header: 'NOMOR', key: 'number' },
			{ header: 'NET WEIGHT', key: 'netWeight' },
			{ header: 'GROSS WEIGHT', key: 'grossWeight' },
			{ header: 'REPAIR CHARGE', key: 'repairCharge' },
			{ header: 'NET TOTAL PRICE', key: 'netTotalPrice' },
		],
	},
]
