'use client'

import React, { startTransition, useActionState, useEffect, useState } from 'react'

import { initialFormState, mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form-nextjs'
import { toast } from 'sonner'

import { updatePassword } from '@/lib/features/auth/auth-action'
import { authSchema } from '@/lib/features/auth/auth-validation'
import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

export default function UpdatePasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
	const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
	const [state, action] = useActionState(updatePassword, initialFormState)

	const form = useForm({
		defaultValues: { password: '' },
		validators: { onSubmitAsync: authSchema.pick({ password: true }) },
		transform: useTransform((baseForm) => mergeForm(baseForm, state ?? {}), [state]),
		onSubmit: ({ value }) => {
			const formData = new FormData()
			Object.entries(value).forEach(([key, value]) => {
				formData.append(key, value)
			})

			startTransition(() => {
				action(formData)
			})
		},
	})

	const isSubmitSuccessful = useStore(form.store, (formState) => formState.isSubmitSuccessful)

	useEffect(() => {
		if (isSubmitSuccessful) {
			toast.success('Your password has been changed successfully', { position: 'top-right' })
		}
	}, [isSubmitSuccessful])

	return (
		<form
			id="forgot-password-form"
			onSubmit={(event) => {
				event.preventDefault()
				event.stopPropagation()
				form.handleSubmit()
			}}
			className={cn('flex flex-col gap-6', className)}
			{...props}
		>
			<FieldGroup>
				<div className="flex flex-col justify-center gap-1">
					<h1 className="text-2xl font-bold">Change your password</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Enter a new password below to change your password
					</p>
				</div>
				<form.Field name="password" defaultValue="">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Password</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id={field.name}
										name={field.name}
										value={field.state.value}
										type={visiblePassword ? 'text' : 'password'}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										aria-invalid={isInvalid}
										placeholder="*************"
										required
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											aria-label={visiblePassword ? 'Show password' : 'Hide password'}
											size="icon-xs"
											onClick={() => setVisiblePassword(!visiblePassword)}
										>
											{visiblePassword ? <Icons.eye /> : <Icons.eyeOff />}
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>
								<FieldDescription>Must be at least 8 characters long.</FieldDescription>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						)
					}}
				</form.Field>
				<form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
					{([canSubmit, isSubmitting]) => {
						return (
							<Field>
								<Button type="submit" disabled={!canSubmit} variant="outline">
									{isSubmitting && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
									Reset password
								</Button>
							</Field>
						)
					}}
				</form.Subscribe>
			</FieldGroup>
		</form>
	)
}
