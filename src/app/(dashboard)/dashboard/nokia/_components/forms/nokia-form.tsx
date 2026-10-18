'use client'

import React from 'react'

import { useForm } from '@tanstack/react-form-nextjs'
import { toast } from 'sonner'

import { useNokiaActions } from '@/lib/features/nokia/nokia-store-provider'
import { nokiaShipmentFormOptions, nokiaShipmentSchema } from '@/lib/features/nokia/nokia-validation'
import { cn, getErrorMessage } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export default function NokiaForm({ className, ...props }: React.ComponentProps<'form'>) {
	const { processShipment } = useNokiaActions()

	const form = useForm({
		...nokiaShipmentFormOptions,
		validators: { onSubmitAsync: nokiaShipmentSchema },
		onSubmit: async ({ value }) => {
			if (!value.shipmentFile) {
				throw new Error('Belum ada file shipment yang dipilih')
			}

			try {
				await processShipment(value.shipperCountry, value.shipmentFile)
			} catch (error) {
				toast.error(getErrorMessage(error) || 'Gagal memproses file shipment', { position: 'top-right' })
				return
			}
		},
	})

	return (
		<form
			id="nokia-shipment-form"
			onSubmit={(event) => {
				event.preventDefault()
				event.stopPropagation()
				form.handleSubmit()
			}}
			className={cn(className)}
			{...props}
		>
			<FieldGroup className="p-6">
				<FieldSet>
					<FieldGroup>
						<form.Field name="shipperCountry">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Negara asal</FieldLabel>
										<Select name={field.name} value={field.state.value} onValueChange={field.handleChange}>
											<SelectTrigger id={field.name} onBlur={field.handleBlur} aria-invalid={isInvalid}>
												<SelectValue placeholder="Choose alkes country of origin" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Negara</SelectLabel>
													<SelectItem value="hungary">Hungary</SelectItem>
													<SelectItem value="india">India</SelectItem>
													<SelectItem value="thailand">Thailand</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
						<form.Subscribe selector={(state) => [state.values.shipperCountry]}>
							{([shipperCountry]) =>
								shipperCountry === 'india' ? (
									<form.Field name="totalDataRows">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Jumlah barang</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														type="number"
														min={1}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(event) => {
															field.handleChange(Number(event.target.value))
														}}
														aria-invalid={isInvalid}
														placeholder="contoh: 25"
													/>

													{isInvalid && <FieldError errors={field.state.meta.errors} />}
												</Field>
											)
										}}
									</form.Field>
								) : null
							}
						</form.Subscribe>
						<form.Field name="shipmentFile">
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
												const file = event.target.files?.[0] ?? null
												if (file) {
													field.handleChange(file)
												}
											}}
										/>
										<FieldDescription>Pilih berkas shipment nokia untuk diproses</FieldDescription>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
					</FieldGroup>
				</FieldSet>
			</FieldGroup>
			<div className="border-t p-6">
				<form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
					{([canSubmit, isSubmitting]) => {
						return (
							<React.Fragment>
								<Button type="submit" form="nokia-shipment-form" disabled={!canSubmit} variant="default">
									{isSubmitting && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
									Proses
								</Button>
							</React.Fragment>
						)
					}}
				</form.Subscribe>
			</div>
		</form>
	)
}
