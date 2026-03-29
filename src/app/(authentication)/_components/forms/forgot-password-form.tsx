'use client'

import React, { useActionState, useEffect } from 'react'

import { initialFormState, mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form-nextjs'
import { toast } from 'sonner'

import { resetPasswordForEmail } from '@/lib/features/auth/auth-action'
import { authSchema } from '@/lib/features/auth/auth-validation'
import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
	const [state, action] = useActionState(resetPasswordForEmail, initialFormState)

	const form = useForm({
		defaultValues: { email: '' },
		validators: { onSubmitAsync: authSchema.pick({ email: true }) },
		transform: useTransform((baseForm) => mergeForm(baseForm, state ?? {}), [state]),
	})

	const isSubmitSuccessful = useStore(form.store, (formState) => formState.isSubmitSuccessful)

	useEffect(() => {
		if (isSubmitSuccessful) {
			toast.info('Password reset link has been sent to your email', { position: 'top-right' })
		}
	}, [isSubmitSuccessful])

	return (
		<form
			id="forgot-password-form"
			action={action as never}
			onSubmit={() => form.handleSubmit()}
			className={cn('flex flex-col gap-6', className)}
			{...props}
		>
			<FieldGroup>
				<div className="flex flex-col justify-center gap-1">
					<h1 className="text-2xl font-bold">Forgot your password</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Enter the email address used for your account and we will send you a link to reset your password
					</p>
				</div>
				<form.Field name="email" defaultValue="">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									type="email"
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									aria-invalid={isInvalid}
									placeholder="youremail@email.com"
									autoComplete="off"
									required
								/>
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
									Send password reset link
								</Button>
							</Field>
						)
					}}
				</form.Subscribe>
			</FieldGroup>
		</form>
	)
}
