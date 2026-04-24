'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import { useAlkesActions, useAlkesItems, useDistinctAlkes } from '@/lib/features/alkes/alkes-store-provider'

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

export default function SearchAlkesFooter() {
	const pathname = usePathname()

	const alkesItems = useAlkesItems()
	const alkes = useDistinctAlkes()

	const { clearAllAlkesItems, exportAlkesToZip, exportAlkesToExcel } = useAlkesActions()

	return (
		<div className="mt-auto flex items-center justify-between border-t border-slate-300 bg-background px-4 py-3 sm:px-6 lg:px-8">
			<p className="shrink-0 text-[13px] text-slate-700">
				<span className="font-extrabold">{alkesItems.length}</span> barang dan{' '}
				<span className="font-extrabold">{alkes.length}</span> izin AKL terpilih
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
									action={() => exportAlkesToExcel(alkesItems)}
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
							<DropdownMenuItem asChild>
								<ActionButton
									variant="ghost"
									className="w-full justify-start px-1.5 font-normal"
									action={() => exportAlkesToZip(pathname, alkes)}
									message={{
										loading: 'Menyiapkan berkas ZIP...',
										success: 'Berkas ZIP berhasil diunduh!',
										error: 'Maaf, terjadi kesalahan saat mengunduh berkas ZIP',
									}}
								>
									<Icons.fileArchive className="size-4 text-primary" />
									Download AKL &#40;zip&#41;
								</ActionButton>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem variant="destructive" onClick={() => clearAllAlkesItems()}>
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
						action={() => exportAlkesToExcel(alkesItems)}
						message={{
							loading: 'Menyiapkan berkas excel...',
							success: 'Berkas excel berhasil diunduh!',
							error: 'Maaf, terjadi kesalahan saat mengunduh berkas excel',
						}}
					>
						Export &#40;xlsx&#41;
					</ActionButton>
					<ActionButton
						variant="outline"
						className="h-max px-2 py-1 text-[13px]"
						action={() => exportAlkesToZip(pathname, alkes)}
						message={{
							loading: 'Menyiapkan berkas ZIP...',
							success: 'Berkas ZIP berhasil diunduh!',
							error: 'Maaf, terjadi kesalahan saat mengunduh berkas ZIP',
						}}
					>
						Download &#40;zip&#41;
					</ActionButton>
				</div>
				<Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
				<Button variant="destructive" className="h-max px-2 py-1 text-[13px]" onClick={() => clearAllAlkesItems()}>
					Reset tabel
				</Button>
			</div>
		</div>
	)
}
