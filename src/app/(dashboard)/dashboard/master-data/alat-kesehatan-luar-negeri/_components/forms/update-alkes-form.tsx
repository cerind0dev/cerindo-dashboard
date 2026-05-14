'use client'

import React, { useState } from 'react'

import { useForm } from '@tanstack/react-form-nextjs'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
	deleteAlkesFile,
	uploadAlkesFile,
	useDeleteAlkesMutation,
	useUpdateAlkesMutation,
} from '@/lib/features/alkes/alkes-queries'
import { updateAlkesFormOptions, updateAlkesSchema } from '@/lib/features/alkes/alkes-validation'
import { getCountriesQueryOptions } from '@/lib/features/countries/countries-queries'
import { getHscodeQueryOptions } from '@/lib/features/hscode/hscode-queries'
import { createClient } from '@/lib/supabase/client'
import { cn, getErrorMessage } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { AlkesByIdWithCountriesAndHscode } from '@/lib/features/alkes/alkes.types'

interface UpdateAlkesFormProps extends React.ComponentProps<'form'> {
	alkes: AlkesByIdWithCountriesAndHscode
	onActionSuccess?: () => void
}

export default function UpdateAlkesForm({ className, alkes, onActionSuccess, ...props }: UpdateAlkesFormProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

	const countriesQuery = useQuery(getCountriesQueryOptions())
	const hscodeQuery = useQuery(getHscodeQueryOptions())

	const updateAlkesMutation = useUpdateAlkesMutation(alkes.id)
	const deleteAlkesMutation = useDeleteAlkesMutation(alkes.id)

	const [fileUrl, setFileUrl] = useState<string>(alkes.file_url)

	const form = useForm({
		...updateAlkesFormOptions(alkes),
		validators: { onSubmitAsync: updateAlkesSchema },
		onSubmit: async ({ value }) => {
			const supabase = createClient()

			try {
				const oldFileUrl = alkes.file_url

				if (value.file instanceof File) {
					try {
						await uploadAlkesFile(supabase, value.file)
						if (value.fileUrl !== oldFileUrl) {
							await deleteAlkesFile(supabase, oldFileUrl)
						}
					} catch (storageError: unknown) {
						toast.error(getErrorMessage(storageError) || 'Gagal meng-upload berkas alkes', { position: 'top-right' })
						return
					}
				}

				await updateAlkesMutation.mutateAsync({
					brand_name: value.brandName?.trim() === '' ? null : value.brandName,
					packaging: value.packaging?.trim() === '' ? null : value.packaging,
					creation_date: value.creationDate,
					expiry_date: value.expiryDate,
					file_url: value.fileUrl,
					id_country: value.countryId,
					id_hscode: value.hscodeId,
				})
				onActionSuccess?.()
			} catch {}
		},
	})

	const handleDeleteAlkes = async () => {
		const supabase = createClient()

		try {
			await deleteAlkesMutation.mutateAsync()

			if (alkes.file_url) {
				try {
					await deleteAlkesFile(supabase, alkes.file_url)
				} catch (storageError: unknown) {
					toast.error(getErrorMessage(storageError) || 'Gagal menghapus berkas alkes', { position: 'top-right' })
					return
				}
			}

			setShowDeleteDialog(false)
			onActionSuccess?.()
		} catch {
			setShowDeleteDialog(false)
		}
	}

	return (
		<form
			id="update-alkes-form"
			onSubmit={(event) => {
				event.preventDefault()
				event.stopPropagation()
				form.handleSubmit()
			}}
			className={cn('', className)}
			{...props}
		>
			<FieldGroup>
				<FieldSet>
					<FieldGroup>
						<form.Field name="brandName" defaultValue={alkes.brand_name}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Merek dagang</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value ?? ''}
											placeholder="-"
											type="text"
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="packaging" defaultValue={alkes.packaging}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Kemasan</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value ?? ''}
											placeholder="-"
											type="text"
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(event.target.value)}
											aria-invalid={isInvalid}
											autoComplete="off"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="creationDate">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tanggal terbit</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={new Date(field.state.value).toISOString().split('T')[0]}
											type="date"
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(new Date(event.target.value).toISOString())}
											aria-invalid={isInvalid}
											autoComplete="off"
											required
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="expiryDate">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tanggal kadaluarsa</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={new Date(field.state.value).toISOString().split('T')[0]}
											type="date"
											onBlur={field.handleBlur}
											onChange={(event) => field.handleChange(new Date(event.target.value).toISOString())}
											aria-invalid={isInvalid}
											autoComplete="off"
											required
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="file">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Berkas</FieldLabel>
										<Input
											id={`${field.name}-actual-file`}
											name={`${field.name}-actual-file`}
											type="file"
											className="file:rounded-full file:border-0 file:bg-primary/5 file:px-2 file:text-sm file:hover:bg-primary/10"
											onChange={(event) => {
												const file = event.target.files?.[0]
												if (file) {
													field.handleChange(file)
													setFileUrl(file.name)
													form.setFieldValue('fileUrl', file.name)
												}
											}}
										/>
										<FieldDescription>Pilih berkas alkes untuk diupload</FieldDescription>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="fileUrl" defaultValue={fileUrl}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid} className="hidden">
										<FieldLabel htmlFor={field.name}>Berkas</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											type="hidden"
											onBlur={field.handleBlur}
											onChange={(event) => {
												field.handleChange(event.target.value)
											}}
											aria-invalid={isInvalid}
											placeholder="Enter the file name complete with its file extension"
											autoComplete="off"
											required
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="countryId" defaultValue={alkes.countries.id}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Negara asal</FieldLabel>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={field.handleChange}
											onOpenChange={(open) => {
												if (open) countriesQuery.refetch()
											}}
										>
											<SelectTrigger id={field.name} onBlur={field.handleBlur} aria-invalid={isInvalid}>
												<SelectValue placeholder="Choose alkes country of origin">
													{/**
													 * if there is a value provided to the parent <Select>, it tries to find
													 * a matching <SelectItem> to get the display text
													 * since countries is empty (because we haven't refetch()) <SelectValue> finds no match
													 * so, have to manually show the country name from our initial data
													 */}
													{field.state.value === alkes.countries.id ? alkes.countries.name : undefined}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{countriesQuery.isPending ? (
														<div className="flex items-center justify-center p-4 text-sm">Loading countries...</div>
													) : (
														countriesQuery.data?.map((country) => {
															return (
																<SelectItem key={country.id} value={country.id}>
																	{country.name}
																</SelectItem>
															)
														})
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Field name="hscodeId" defaultValue={alkes.hscode.id}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Hscode</FieldLabel>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={field.handleChange}
											onOpenChange={(open) => {
												if (open) hscodeQuery.refetch()
											}}
										>
											<SelectTrigger id={field.name} onBlur={field.handleBlur} aria-invalid={isInvalid}>
												<SelectValue placeholder="Choose alkes hscode">
													{field.state.value === alkes.hscode.id ? alkes.hscode.code : undefined}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{hscodeQuery.isPending ? (
														<div className="flex items-center justify-center p-4 text-sm">Loading hscode...</div>
													) : (
														hscodeQuery.data?.map((hscode) => {
															return (
																<SelectItem key={hscode.id} value={hscode.id}>
																	{hscode.code}
																</SelectItem>
															)
														})
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<FieldGroup>
							<form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
								{([canSubmit, isSubmitting]) => {
									return (
										<Field>
											<Button type="submit" disabled={!canSubmit} variant="default">
												{isSubmitting && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
												Update
											</Button>
										</Field>
									)
								}}
							</form.Subscribe>
							<Field>
								<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
									<DialogTrigger asChild>
										<Button
											type="button"
											variant="destructive"
											disabled={deleteAlkesMutation.isPending || updateAlkesMutation.isPending}
										>
											Hapus
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Delete alkes?</DialogTitle>
											<DialogDescription>
												Apakah Anda yakin akan menghapus <strong>{alkes.id.split('_').join(' ')}?</strong> Data alkes
												dan item terkait akan dihapus secara permanen
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<Button
												type="button"
												variant="outline"
												disabled={deleteAlkesMutation.isPending}
												onClick={() => setShowDeleteDialog(false)}
											>
												Batal
											</Button>
											<Button
												type="button"
												variant="destructive"
												disabled={deleteAlkesMutation.isPending}
												onClick={handleDeleteAlkes}
											>
												{deleteAlkesMutation.isPending && (
													<Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
												)}
												Hapus
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</FieldSet>
			</FieldGroup>
		</form>
	)
}
