import React from 'react'

import { rubik } from '@/config/font'

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import NokiaForm from './_components/forms/nokia-form'
import NokiaShipmentFooter from './_components/nokia-shipment-footer'
import NokiaShipmentTable from './_components/nokia-shipment-table'

export default async function NokiaPage() {
	return (
		<div className="flex h-full flex-auto flex-col overflow-y-auto bg-white text-secondary-foreground">
			<div className="flex flex-col gap-6 px-4 py-8">
				<PageHeader as={'div'} className="max-w-full px-5">
					<PageHeaderHeading className={`${rubik.className}`}>Nokia</PageHeaderHeading>
					<PageHeaderDescription>Proses shipment impor dan ekspor nokia dengan cepat</PageHeaderDescription>
				</PageHeader>
			</div>
			<Tabs defaultValue="import" className="max-w-full gap-0">
				<div className="w-full border-b">
					<TabsList variant="line" className="gap-4 px-9">
						<TabsTrigger value="import">Impor</TabsTrigger>
						<TabsTrigger value="export">Ekspor</TabsTrigger>
					</TabsList>
				</div>
				<div className="border-b bg-primary/5 p-9">
					<div className="rounded-md border bg-white shadow-xs">
						<NokiaForm />
					</div>
				</div>
				<TabsContent value="import">
					<NokiaShipmentTable />
					<NokiaShipmentFooter />
				</TabsContent>
				<TabsContent value="export" className="p-9">
					<div className="m-6 rounded border-2 border-dashed border-primary/15 py-4 text-center">
						<p className="text-sm font-medium">Work in progress</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
