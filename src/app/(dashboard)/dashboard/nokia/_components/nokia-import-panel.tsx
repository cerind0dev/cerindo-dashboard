'use client'

import React from 'react'

import NokiaForm from './forms/nokia-form'
import NokiaShipmentFooter from './nokia-shipment-footer'
import NokiaShipmentTable from './nokia-shipment-table'

export default function NokiaImportPanel() {
	return (
		<React.Fragment>
			<div className="border-b bg-primary/5 p-9">
				<div className="rounded-md border bg-white shadow-xs">
					<NokiaForm direction="import" />
				</div>
			</div>
			<NokiaShipmentTable />
			<NokiaShipmentFooter />
		</React.Fragment>
	)
}
