'use client'

import React, { useState } from 'react'

import { useForm } from '@tanstack/react-form-nextjs'

import { useCreateAlkesItemMutation } from '@/lib/features/alkes/alkes-queries'
import { createAlkesItemFormOptions, createAlkesItemSchema } from '@/lib/features/alkes/alkes-validation'
import { Alkes } from '@/lib/features/alkes/alkes.types'
import { cn } from '@/lib/utils/utils'

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

interface CreateAlkesItemFormProps extends React.ComponentProps<'form'> {
	alkesId: Alkes['id']
}

export default function CreateAlkesItemForm({ alkesId, className, ...props }: CreateAlkesItemFormProps) {
	const createAlkesItemMutation = useCreateAlkesItemMutation()

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const form = useForm({
		...createAlkesItemFormOptions,
		validators: { onSubmitAsync: createAlkesItemSchema },
		onSubmit: async ({ value }) => {
			try {
				await createAlkesItemMutation.mutateAsync({
					type: value.type,
					name: value.name?.trim() === '' ? null : value.name,
					facility: value.facility?.trim() === '' ? null : value.facility,
					description: value.description?.trim() === '' ? null : value.description,
					id_alkes: alkesId,
				})

				form.reset()
				setIsOpen(false)
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
				id="create-alkes-item-form"
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
						<DialogDescription>Anda akan menambahkan data item alkes baru ke dalam database</DialogDescription>
					</DialogHeader>
					<div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
						<FieldGroup>
							<FieldSet>
								<FieldGroup>
									<form.Field name="type">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Tipe item</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value ?? ''}
														type="text"
														placeholder="Masukkan tipe item tertera di lampiran alkes"
														onBlur={field.handleBlur}
														onChange={(event) => field.handleChange(event.target.value)}
														aria-invalid={isInvalid}
														autoComplete="off"
														required
													/>
													{isInvalid && <FieldError errors={field.state.meta.errors} />}
												</Field>
											)
										}}
									</form.Field>
									<form.Field name="name">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Deskripsi di alkes</FieldLabel>
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
													<FieldDescription>Deskripsi item sesuai keterangan pada lampiran alkes</FieldDescription>
												</Field>
											)
										}}
									</form.Field>
									<form.Field name="facility">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Fasilitas</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														value={field.state.value ?? ''}
														type="text"
														onBlur={field.handleBlur}
														onChange={(event) => field.handleChange(event.target.value)}
														aria-invalid={isInvalid}
														placeholder="Tuliskan kode fasilitas. contoh: 06 untuk ATIGA"
														autoComplete="off"
													/>
													{isInvalid && <FieldError errors={field.state.meta.errors} />}
												</Field>
											)
										}}
									</form.Field>
									<form.Field name="description">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel htmlFor={field.name}>Deskripsi di invoice</FieldLabel>
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
													<FieldDescription>Deskripsi item sesuai keterangan pada invoice</FieldDescription>
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
										<Button type="submit" form="create-alkes-item-form" disabled={!canSubmit} variant="default">
											{isSubmitting && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
											Tambah item
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
