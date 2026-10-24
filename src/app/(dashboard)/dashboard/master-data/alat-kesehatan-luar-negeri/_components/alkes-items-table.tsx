'use client'

import React, { useMemo, useState } from 'react'

import { useForm } from '@tanstack/react-form-nextjs'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'

import {
	getAlkesItemsByAlkesIdQueryOptions,
	useDeleteAlkesItemMutation,
	useUpdateAlkesItemMutation,
} from '@/lib/features/alkes/alkes-queries'
import { updateAlkesItemFormOptions, updateAlkesItemSchema } from '@/lib/features/alkes/alkes-validation'
import useDataTable from '@/lib/hooks/use-data-table'
import { cn } from '@/lib/utils/utils'

import { DataTable } from '@/components/data-table/data-table'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import DataTableToolbar from '@/components/data-table/data-table-toolbar'
import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'

import CreateAlkesItemForm from './forms/create-alkes-item-form'

import type { Alkes, AlkesItemsByTypeWithCountriesAndHscode } from '@/lib/features/alkes/alkes.types'
import type { Row } from '@tanstack/react-table'

interface AlkesItemsTableRowDetailProps extends React.ComponentProps<'form'> {
	row: Row<AlkesItemsByTypeWithCountriesAndHscode[number]>
}

function AlkesItemsTableRowDetail({ row, className, ...props }: AlkesItemsTableRowDetailProps) {
	const data = row.original
	const fieldCanBeUpdated = {
		type: data.type,
		name: data.name,
		facility: data.facility,
		description: data.description,
	}

	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
	const deleteAlkesItemMutation = useDeleteAlkesItemMutation(data.id)
	const updateAlkesItemMutation = useUpdateAlkesItemMutation(data.id)

	const handleDeleteAlkesItem = async () => {
		try {
			await deleteAlkesItemMutation.mutateAsync()
			setShowDeleteDialog(false)
		} catch {
			setShowDeleteDialog(false)
		}
	}

	const form = useForm({
		...updateAlkesItemFormOptions(fieldCanBeUpdated),
		validators: { onSubmitAsync: updateAlkesItemSchema },
		onSubmit: async ({ value }) => {
			try {
				await updateAlkesItemMutation.mutateAsync({
					type: value.type,
					name: value.name?.trim() === '' ? null : value.name,
					facility: value.facility?.trim() === '' ? null : value.facility,
					description: value.description?.trim() === '' ? null : value.description,
				})
			} catch {
				return
			}
		},
	})

	return (
		<form
			id="update-alkes-item-form"
			onSubmit={(event) => {
				event.preventDefault()
				event.stopPropagation()
				form.handleSubmit()
			}}
			className={cn(className)}
			{...props}
		>
			<div className="grid grid-cols-12 gap-5 bg-white px-6 py-8">
				<div className="col-span-12 space-y-4 xl:col-span-6">
					<div className="grid grid-cols-4 gap-4">
						<div className="col-span-4 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-2">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Kode AKL</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.id.split('_').join(' ')}</p>
						</div>
						<form.Field name="type" defaultValue={fieldCanBeUpdated.type}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid} className="col-span-4 sm:col-span-1">
										<InputGroup className="h-auto rounded border border-primary/15 shadow">
											<InputGroupInput
												id={field.name}
												name={field.name}
												value={field.state.value}
												type="text"
												onBlur={field.handleBlur}
												onChange={(event) => field.handleChange(event.target.value)}
												aria-invalid={isInvalid}
												autoComplete="off"
												className="mt-1 px-2.5 pt-0! pb-2! text-sm text-primary/85"
											/>
											<InputGroupAddon align="block-start" className="px-2.5 pt-2! pb-0!">
												<InputGroupText className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
													Tipe
												</InputGroupText>
												<InputGroupText className="ml-auto text-xs font-light">*bisa diupdate</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<div className="col-span-4 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">HS Code</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.hscode.code}</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Merek</p>
							<p className="mt-1 truncate text-sm text-primary/85">{data.alkes.brand_name}</p>
						</div>
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Kemasan</p>
							<p className="mt-1 truncate text-sm text-primary/85">{data.alkes.packaging}</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Negara asal</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.countries.name}</p>
						</div>
						<div className="col-span-2 rounded border border-primary/15 px-2.5 py-2 shadow sm:col-span-1">
							<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
								Kode negara asal
							</p>
							<p className="mt-1 text-sm text-primary/85">{data.alkes.countries.code}</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<form.Field name="description" defaultValue={fieldCanBeUpdated.description}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid} className="col-span-2 sm:col-span-1">
										<InputGroup className="h-auto rounded border border-primary/15 shadow">
											<InputGroupInput
												id={field.name}
												name={field.name}
												value={field.state.value ?? ''}
												placeholder="-"
												type="text"
												onBlur={field.handleBlur}
												onChange={(event) => field.handleChange(event.target.value)}
												aria-invalid={isInvalid}
												autoComplete="off"
												className="mt-1 truncate px-2.5 pt-0! pb-2! text-sm text-primary/85"
											/>
											<InputGroupAddon align="block-start" className="px-2.5 pt-2! pb-0!">
												<InputGroupText className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
													Deskripsi di invoice
												</InputGroupText>
												<InputGroupText className="ml-auto text-xs font-light">*bisa diupdate</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="name" defaultValue={fieldCanBeUpdated.name}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field className="col-span-2 sm:col-span-1">
										<InputGroup className="h-auto rounded border border-primary/15 shadow">
											<InputGroupInput
												id={field.name}
												name={field.name}
												value={field.state.value ?? ''}
												placeholder="-"
												type="text"
												onBlur={field.handleBlur}
												onChange={(event) => field.handleChange(event.target.value)}
												aria-invalid={isInvalid}
												autoComplete="off"
												className="mt-1 truncate px-2.5 pt-0! pb-2! text-sm text-primary/85"
											/>
											<InputGroupAddon align="block-start" className="px-2.5 pt-2! pb-0!">
												<InputGroupText className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
													Deskripsi di alkes
												</InputGroupText>
												<InputGroupText className="ml-auto text-xs font-light">*bisa diupdate</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
					</div>
				</div>
				<div className="col-span-12 space-y-4 xl:col-span-3">
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Biaya masuk</p>
						<p className="relative mt-1 text-sm text-primary/85">
							{data.alkes.hscode.import_dutyfees}
							<span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">PPN</p>
						<p className="relative mt-1 text-sm text-primary/85">
							{data.alkes.hscode.value_added_tax}
							<span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
							PPH &#40;API&#41;
						</p>
						<p className="relative mt-1 text-sm text-primary/85">
							{data.alkes.hscode.income_tax_api} <span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
							PPH &#40;Non-API&#41;
						</p>
						<p className="relative mt-1 block text-sm text-primary/85">
							{data.alkes.hscode.income_tax_non_api}
							<span className="absolute right-0 text-slate-400">&#37;</span>
						</p>
					</div>
				</div>
				<div className="col-span-12 space-y-4 xl:col-span-3">
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Tanggal AKL</p>
						<p className="mt-1 text-sm text-primary/85">
							{new Date(String(data.alkes.creation_date)).toLocaleDateString('id')}
						</p>
					</div>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
							Tanggal kadaluarsa AKL
						</p>
						<p className="mt-1 text-sm text-primary/85">
							{new Date(String(data.alkes.expiry_date)).toLocaleDateString('id')}
						</p>
					</div>
					<form.Field name="facility" defaultValue={fieldCanBeUpdated.facility}>
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

							return (
								<Field>
									<InputGroup className="h-auto rounded border border-primary/15 shadow">
										<InputGroupInput
											id={field.name}
											name={field.name}
											value={field.state.value ?? ''}
											placeholder="-"
											type="text"
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
											className="mt-1 truncate px-2.5 pt-0 pb-2! text-sm text-primary/85"
										/>
										<InputGroupAddon align="block-start" className="px-2.5 pt-2 pb-0!">
											<InputGroupText className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">
												Fasilitas
											</InputGroupText>
											<InputGroupText className="ml-auto text-xs font-light">*bisa diupdate</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					</form.Field>
					<div className="rounded border border-primary/15 px-2.5 py-2 shadow">
						<p className="text-left text-sm leading-4.5 font-semibold tracking-normal text-primary">Lartas</p>
						<p className="mt-1 text-sm text-primary/85">
							{data.alkes.hscode.lartas !== null ? data.alkes.hscode.lartas : '-'}
						</p>
					</div>
				</div>
			</div>
			<div className="flex flex-row gap-x-2 border-t border-primary/15 px-6 py-4 shadow-lg">
				<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
					<DialogTrigger asChild>
						<Button type="button" variant="destructive" disabled={deleteAlkesItemMutation.isPending}>
							Hapus
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete item {`${data.type}`}?</DialogTitle>
							<DialogDescription>
								Apakah Anda yakin akan menghapus <strong>{`${data.type}`}?</strong> Data item akan dihapus secara
								permanen
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								disabled={deleteAlkesItemMutation.isPending}
								onClick={() => setShowDeleteDialog(false)}
							>
								Batal
							</Button>
							<Button
								type="button"
								variant="destructive"
								disabled={deleteAlkesItemMutation.isPending}
								onClick={handleDeleteAlkesItem}
							>
								{deleteAlkesItemMutation.isPending && (
									<Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
								)}
								Hapus
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
					{([canSubmit, isSubmitting]) => {
						return (
							<Field className="w-max">
								<Button type="submit" disabled={!canSubmit} variant="outline">
									{isSubmitting && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
									Update
								</Button>
							</Field>
						)
					}}
				</form.Subscribe>
			</div>
		</form>
	)
}

interface AlkesItemsTableProps {
	alkesId: Alkes['id']
}

export default function AlkesItemsTable({ alkesId }: AlkesItemsTableProps) {
	const { data, isPending, error } = useQuery(getAlkesItemsByAlkesIdQueryOptions(alkesId))

	const columnHelper = createColumnHelper<AlkesItemsByTypeWithCountriesAndHscode[number]>()
	const columns = useMemo(
		() => [
			columnHelper.accessor('type', {
				id: 'alkes-item-type',
				header: () => <DataTableColumnHeader title="Tipe" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					label: 'Tipe',
					placeholder: 'Cari item alkes berdasarkan tipe item alkes...',
					variant: 'text',
					headerClassName: 'hidden md:table-cell pr-0',
					rowClassName: 'hidden md:table-cell pr-0',
				},
				enableColumnFilter: true,
				filterFn: 'equalsString',
			}),
			columnHelper.accessor('name', {
				id: 'alkes-item-name',
				header: () => <DataTableColumnHeader title="Deskripsi di alkes" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
			}),
			columnHelper.accessor((row) => `${row.alkes.countries.name} / ${row.alkes.countries.code}`, {
				id: 'alkes-item-country',
				header: () => <DataTableColumnHeader title="Negara" />,
				cell: (info) => {
					return <span>{info.getValue()}</span>
				},
				meta: {
					headerClassName: 'hidden lg:table-cell',
					rowClassName: 'hidden lg:table-cell',
				},
			}),
			columnHelper.display({
				id: 'alkes-item-details',
				header: () => <DataTableColumnHeader title="Details" />,
				cell: () => (
					<CollapsibleTrigger asChild>
						<Button variant="outline" size="icon" className="rounded-full">
							<Icons.chevronDown className="size-4 text-primary" />
							<span className="sr-only">Open row details</span>
						</Button>
					</CollapsibleTrigger>
				),
				meta: {
					headerClassName: 'pl-0',
					rowClassName: 'pl-0',
				},
			}),
		],
		[columnHelper],
	)

	const { table } = useDataTable({
		data: data ?? [],
		columns,
		getRowId: (row) => row.id,
		autoResetAll: false,
	})

	return isPending ? (
		<div className="flex max-w-full flex-auto flex-col overflow-auto">
			<Card className="rounded-none border-0 shadow-none">
				<CardContent className="flex w-full flex-col gap-8">
					{Array.from({ length: 4 }).map((_, index) => (
						<div className="flex gap-4" key={index}>
							<Skeleton className="hidden h-8 flex-1 sm:block" />
							<Skeleton className="h-8 flex-4" />
							<Skeleton className="hidden h-8 flex-1 md:block" />
							<Skeleton className="h-8 flex-1" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	) : (
		<DataTable
			className="bg-muted shadow-md"
			table={table}
			stickyHeader={false}
			emptyDataText="Alkes ini tidak memiliki item terdaftar"
			renderRowDetails={(row) => <AlkesItemsTableRowDetail row={row} />}
		>
			<DataTableToolbar table={table} className="border-b px-6 py-3">
				<CreateAlkesItemForm alkesId={alkesId} />
			</DataTableToolbar>
		</DataTable>
	)
}
