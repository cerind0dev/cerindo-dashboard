'use client'

import React, { useActionState, useEffect } from 'react'

import { initialFormState, mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form-nextjs'
import { toast } from 'sonner'

import { resendEmailRegistration } from '@/lib/features/auth/auth-action'
import { authSchema } from '@/lib/features/auth/auth-validation'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface ResendEmailButtonProps {
	email: string
}

export default function ResendEmailButton({ email }: ResendEmailButtonProps) {
	const [state, action] = useActionState(resendEmailRegistration, initialFormState)

	const form = useForm({
		defaultValues: { email: '' },
		validators: { onSubmitAsync: authSchema.pick({ email: true }) },
		transform: useTransform((baseForm) => mergeForm(baseForm, state ?? {}), [state]),
	})

	const isSubmitSuccessful = useStore(form.store, (formState) => formState.isSubmitSuccessful)

	useEffect(() => {
		if (isSubmitSuccessful) {
			toast.info('Confirmation email has been resent', { position: 'top-right' })
		}
	}, [isSubmitSuccessful])

	return (
		<form id="resend-email-form" action={action as never} onSubmit={() => form.handleSubmit()}>
			<FieldGroup>
				<form.Field name="email" defaultValue={email}>
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid}>
								<Input id={field.name} name={field.name} defaultValue={email} hidden />
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
									Resend confirmation email
								</Button>
							</Field>
						)
					}}
				</form.Subscribe>
			</FieldGroup>
		</form>
	)
}
