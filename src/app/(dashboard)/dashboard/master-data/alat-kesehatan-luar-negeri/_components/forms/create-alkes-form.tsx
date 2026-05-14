'use client'

import React, { useState } from 'react'

import { useForm } from '@tanstack/react-form-nextjs'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { uploadAlkesFile, useCreateAlkesMutation } from '@/lib/features/alkes/alkes-queries'
import { createAlkesFormOptions, createAlkesSchema } from '@/lib/features/alkes/alkes-validation'
import { getCountriesQueryOptions } from '@/lib/features/countries/countries-queries'
import { getHscodeQueryOptions } from '@/lib/features/hscode/hscode-queries'
import { createClient } from '@/lib/supabase/client'
import { cn, getErrorMessage } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
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

export default function CreateAlkesForm({ className, ...props }: React.ComponentProps<'form'>) {
	const countriesQuery = useQuery(getCountriesQueryOptions())
	const hscodeQuery = useQuery(getHscodeQueryOptions())

	const createAlkesMutation = useCreateAlkesMutation()

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [fileUrl, setFileUrl] = useState<string>('')

	const form = useForm({
		...createAlkesFormOptions,
		validators: { onSubmitAsync: createAlkesSchema },
		onSubmit: async ({ value }) => {
			const supabase = createClient()

			try {
				if (value.file instanceof File) {
					try {
						await uploadAlkesFile(supabase, value.file)
					} catch (storageError: unknown) {
						toast.error(getErrorMessage(storageError) || 'Gagal meng-upload berkas alkes', { position: 'top-right' })
						return
					}
				}

				const idAlkes = value.alkesNumber.split(' ').join('_')

				await createAlkesMutation.mutateAsync({
					id: idAlkes,
					brand_name: value.brandName?.trim() === '' ? null : value.brandName,
					packaging: value.packaging?.trim() === '' ? null : value.packaging,
					creation_date: value.creationDate,
					expiry_date: value.expiryDate,
					file_url: value.fileUrl,
					id_country: value.countryId,
					id_hscode: value.hscodeId,
				})

				form.reset()
				setIsOpen(false)
				setFileUrl('')
			} catch {}
		},
	})

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open)
				if (!open) {
					form.reset()
				}
			}}
		>
			<form
				id="create-alkes-form"
				onSubmit={(event) => {
					event.preventDefault()
					event.stopPropagation()
					form.handleSubmit()
				}}
				className={cn(className)}
				{...props}
			>
				<DialogTrigger asChild>
					<Button className="h-8">Tambah</Button>
				</DialogTrigger>
				<DialogContent className="md:max-w-lg">
					<DialogHeader>
						<DialogTitle>Tambah alkes</DialogTitle>
						<DialogDescription>Anda akan menambahkan data alkes baru ke dalam database</DialogDescription>
					</DialogHeader>
					<div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
						<FieldGroup>
							<FieldSet>
								<FieldGroup>
									<form.Field name="alkesNumber">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Nomor alkes</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value ?? ''}
														type="text"
														onBlur={field.handleBlur}
														onChange={(event) => field.handleChange(event.target.value)}
														aria-invalid={isInvalid}
														autoComplete="off"
														placeholder="AKL [nomor alkes], contoh: AKL 20402220048"
														required
													/>
													{isInvalid && <FieldError errors={field.state.meta.errors} />}
												</Field>
											)
										}}
									</form.Field>
									<form.Field name="brandName">
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
									<form.Field name="packaging">
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
									<FieldSet>
										<FieldDescription className="text-destructive!">
											*Pastikan izin alkes masih berlaku
										</FieldDescription>
										<FieldGroup>
											<div className="grid grid-cols-2 gap-4">
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
											</div>
										</FieldGroup>
									</FieldSet>
									<form.Field name="file">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Berkas</FieldLabel>
													<Input
														key={isOpen ? 'open' : 'closed'}
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
									<form.Field name="countryId">
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
															<SelectValue placeholder="Choose alkes country of origin" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																{countriesQuery.isPending ? (
																	<div className="flex items-center justify-center p-4 text-sm">
																		Loading countries...
																	</div>
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
									<form.Field name="hscodeId">
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
															<SelectValue placeholder="Choose alkes hscode" />
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
								</FieldGroup>
							</FieldSet>
						</FieldGroup>
					</div>
					<DialogFooter>
						<form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
							{([canSubmit, isSubmitting]) => {
								return (
									<React.Fragment>
										<DialogClose asChild>
											<Button
												variant="outline"
												onClick={() => {
													setIsOpen(false)
													form.reset()
												}}
											>
												Batal
											</Button>
										</DialogClose>
										<Button type="submit" form="create-alkes-form" disabled={!canSubmit} variant="default">
											{isSubmitting && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
											Tambah alkes
										</Button>
									</React.Fragment>
								)
							}}
						</form.Subscribe>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	)
}
