'use client'

import React from 'react'

import { useNokiaActions, useNokiaShipment } from '@/lib/features/nokia/nokia-store-provider'

import ActionButton from '@/components/action-button'
import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

export default function NokiaShipmentFooter() {
	const shipment = useNokiaShipment()

	const { exportShipmentToExcel, clearAll } = useNokiaActions()

	return (
		<div className="mt-auto flex items-center justify-between border-t border-slate-300 bg-background px-4 py-3 sm:px-6 lg:px-8">
			<p className="shrink-0 text-[13px] text-slate-700">
				<span className="font-extrabold">{shipment.length}</span> barang
			</p>
			<div className="block lg:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="rounded-full">
							<Icons.ellipsisVertical className="size-4 text-primary" />
							<span className="sr-only">Open table footer menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end" forceMount>
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<ActionButton
									variant="ghost"
									className="w-full justify-start px-1.5 font-normal"
									action={() => exportShipmentToExcel(shipment)}
									message={{
										loading: 'Menyiapkan berkas excel...',
										success: 'Berkas excel berhasil diunduh!',
										error: 'Maaf, terjadi kesalahan saat mengunduh berkas excel',
									}}
								>
									<Icons.download className="size-4 text-primary" />
									Export excel &#40;xlsx&#41;
								</ActionButton>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem variant="destructive" onClick={() => clearAll()}>
								Reset tabel
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="hidden gap-2 lg:flex lg:items-center">
				<div className="flex items-center space-x-2">
					<ActionButton
						variant="outline"
						className="h-max px-2 py-1 text-[13px]"
						action={() => exportShipmentToExcel(shipment)}
						message={{
							loading: 'Menyiapkan berkas excel...',
							success: 'Berkas excel berhasil diunduh!',
							error: 'Maaf, terjadi kesalahan saat mengunduh berkas excel',
						}}
					>
						Export &#40;xlsx&#41;
					</ActionButton>
				</div>
				<Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
				<Button variant="destructive" className="h-max px-2 py-1 text-[13px]" onClick={() => clearAll()}>
					Reset tabel
				</Button>
			</div>
		</div>
	)
}
