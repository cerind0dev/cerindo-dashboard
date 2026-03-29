'use client'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'

import { initialFormState, mergeForm, useForm, useTransform } from '@tanstack/react-form-nextjs'

import { logInWithEmail } from '@/lib/features/auth/auth-action'
import { authFormOptions, authSchema } from '@/lib/features/auth/auth-validation'
import { cn } from '@/lib/utils/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import OAuthLogin from '@/app/(authentication)/_components/oauth-login'

export default function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
	const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
	const [state, action] = useActionState(logInWithEmail, initialFormState)

	const form = useForm({
		...authFormOptions,
		validators: { onSubmitAsync: authSchema },
		transform: useTransform((baseForm) => mergeForm(baseForm, state ?? {}), [state]),
	})

	return (
		<form
			id="login-form"
			action={action as never}
			onSubmit={() => form.handleSubmit()}
			className={cn('flex flex-col gap-6', className)}
			{...props}
		>
			<FieldGroup>
				<div className="flex flex-col justify-center gap-1">
					<h1 className="text-2xl font-bold">Login to your account</h1>
					<p className="text-sm text-balance text-muted-foreground">Enter your email below to login to your account</p>
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
				<form.Field name="password" defaultValue="">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

						return (
							<Field data-invalid={isInvalid}>
								<div className="flex items-center">
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>
									<Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
										Forgot your password?
									</Link>
								</div>
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
									Log in
								</Button>
							</Field>
						)
					}}
				</form.Subscribe>
				<FieldSeparator>Or continue with</FieldSeparator>
				<Field>
					<OAuthLogin />
					<FieldDescription className="px-6 text-center">
						Don&apos;t have an account? <Link href={'/register'}>Sign up</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	)
}
