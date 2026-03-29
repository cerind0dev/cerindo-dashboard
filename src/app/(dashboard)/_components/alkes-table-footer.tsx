'use client'

import React, { useTransition } from 'react'
import { usePathname } from 'next/navigation'

import { toast } from 'sonner'

import { useAlkesActions, useAlkesItems, useDistinctAlkes } from '@/lib/features/alkes/alkes-store-provider'

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

export default function AlkesTableFooter() {
	const [isPending, startTransition] = useTransition()
	const pathname = usePathname()

	const alkesItems = useAlkesItems()
	const alkes = useDistinctAlkes()

	const { clearAllAlkesItems, exportAlkesToZip, exportAlkesToExcel } = useAlkesActions()

	const handleExportAlkesToZip = () => {
		startTransition(async () => {
			toast.promise(exportAlkesToZip(pathname, alkes), {
				loading: 'Menyiapkan berkas ZIP...',
				success: 'Berkas ZIP berhasil diunduh!',
				error: (error) => error.message,
				position: 'top-right',
			})
		})
	}

	const handleExportAlkesToExcel = () => {
		startTransition(async () => {
			toast.promise(exportAlkesToExcel(alkesItems), {
				loading: 'Menyiapkan berkas excel...',
				success: 'Berkas excel berhasil diunduh!',
				error: () => 'Maaf, terjadi kesalahan saat mengunduh berkas excel',
				position: 'top-right',
			})
		})
	}

	return (
		<div className="mt-auto flex items-center justify-between border-t border-slate-300 bg-background px-4 py-3 sm:px-6 lg:px-8">
			<p className="shrink-0 text-[13px] text-slate-700">
				<span className="font-extrabold">{alkesItems.length}</span> barang dan{' '}
				<span className="font-extrabold">{alkes.length}</span> izin AKL terpilih
			</p>
			<div className="block md:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="rounded-full">
							<Icons.ellipsisVertical className="size-4 text-primary" />
							<span className="sr-only">Open table footer menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end" forceMount>
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Icons.download className="mr-2 size-4 text-primary" />
								Export excel &#40;xlsx&#41;
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Icons.fileArchive className="mr-2 size-4 text-primary" />
								Download AKL &#40;zip&#41;
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem variant="destructive">Reset tabel</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="hidden gap-2 md:flex md:items-center">
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="h-max px-2 py-1 text-[13px]"
						disabled={isPending}
						onClick={handleExportAlkesToExcel}
					>
						{isPending && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
						Export &#40;xlsx&#41;
					</Button>
					<Button
						variant="outline"
						className="h-max px-2 py-1 text-[13px]"
						disabled={isPending}
						onClick={handleExportAlkesToZip}
					>
						{isPending && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
						Download &#40;zip&#41;
					</Button>
				</div>
				<Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
				<Button variant="destructive" className="h-max px-2 py-1 text-[13px]" onClick={() => clearAllAlkesItems()}>
					Reset tabel
				</Button>
			</div>
		</div>
	)
}
