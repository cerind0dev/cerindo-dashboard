'use client'

import React, { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'

import { initialFormState, mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form-nextjs'
import { toast } from 'sonner'

import { registerWithEmail } from '@/lib/features/auth/auth-action'
import { authFormOptions, authSchema } from '@/lib/features/auth/auth-validation'
import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

import OAuthLogin from '../oauth-login'

export default function RegistrationForm({ className, ...props }: React.ComponentProps<'form'>) {
	const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
	const [state, action] = useActionState(registerWithEmail, initialFormState)

	const form = useForm({
		...authFormOptions,
		validators: { onSubmitAsync: authSchema },
		transform: useTransform((baseForm) => mergeForm(baseForm, state ?? {}), [state]),
	})

	const isSubmitSuccessful = useStore(form.store, (formState) => formState.isSubmitSuccessful)

	useEffect(() => {
		if (isSubmitSuccessful) {
			toast.success('Account created successfully', { position: 'top-right' })
		}
	}, [isSubmitSuccessful])

	return (
		<form
			id="registration-form"
			action={action as never}
			onSubmit={() => form.handleSubmit()}
			className={cn('flex flex-col gap-6', className)}
			{...props}
		>
			<FieldGroup>
				<div className="flex flex-col justify-center gap-1">
					<h1 className="text-2xl font-bold">Create your account</h1>
					<p className="text-sm text-balance text-muted-foreground">Fill in the form below to create your account</p>
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
								<FieldDescription>
									We&apos;ll use this to contact you. We will not share your email with anyone else.
								</FieldDescription>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						)
					}}
				</form.Field>
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
									Create account
								</Button>
							</Field>
						)
					}}
				</form.Subscribe>
				<FieldSeparator>Or continue with</FieldSeparator>
				<Field>
					<OAuthLogin />
					<FieldDescription className="px-6 text-center">
						Already have an account? <Link href={'/login'}>Log in</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	)
}
