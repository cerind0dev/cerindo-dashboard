'use client'

import React, { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import { useNokiaShipment } from '@/lib/features/nokia/nokia-store-provider'
import { NokiaShipment } from '@/lib/features/nokia/nokia.types'

import useDataTable from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table/data-table'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'

export default function NokiaShipmentTable() {
	const shipment = useNokiaShipment()

	const columnHelper = createColumnHelper<NokiaShipment>()
	const columns = useMemo(
		() => [
			columnHelper.accessor('invoiceNumber', {
				id: 'invoiceNumber',
				header: () => <DataTableColumnHeader title="Nomor Invoice" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					rowClassName: 'py-4',
				},
			}),
			columnHelper.accessor('countryOrigin', {
				id: 'countryOrigin',
				header: () => <DataTableColumnHeader title="Negara Asal" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell py-4',
				},
			}),
			columnHelper.accessor('hscode', {
				id: 'hscode',
				header: () => <DataTableColumnHeader title="HS Code" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					rowClassName: 'py-4',
				},
			}),
			columnHelper.accessor((row) => `${row.description}, SERIAL NO : ${row.numberSerialLeft}`, {
				id: 'description',
				header: () => <DataTableColumnHeader title="Deskripsi Barang" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell py-4',
				},
			}),
			columnHelper.accessor('numberSerialLeft', {
				id: 'numberSerialLeft',
				header: () => <DataTableColumnHeader title="Serial Number" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'table-cell lg:hidden',
					rowClassName: 'table-cell lg:hidden py-4',
				},
			}),
			columnHelper.accessor('repairCharge', {
				id: 'repairCharge',
				header: () => <DataTableColumnHeader title="Repair Charge" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					rowClassName: 'py-4',
				},
			}),
			columnHelper.accessor('netWeight', {
				id: 'netWeight',
				header: () => <DataTableColumnHeader title="Net Weight" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell py-4',
				},
			}),
		],
		[columnHelper],
	)

	const { table } = useDataTable({
		data: shipment ?? [],
		columns,
		getRowId: (row) => row.invoiceNumber,
		autoResetAll: false,
	})

	return <DataTable table={table} stickyHeader={true} emptyDataText="Tidak ada data shipment" />
}
