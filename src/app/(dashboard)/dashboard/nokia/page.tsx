import React from 'react'

import { rubik } from '@/config/font'

import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import NokiaExportPanel from './_components/nokia-export-panel'
import NokiaImportPanel from './_components/nokia-import-panel'

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
				<TabsContent value="import">
					<NokiaImportPanel />
				</TabsContent>
				<TabsContent value="export" className="p-9">
					<NokiaExportPanel />
				</TabsContent>
			</Tabs>
		</div>
	)
}
