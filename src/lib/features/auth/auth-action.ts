'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createServerValidate, ServerValidateError } from '@tanstack/react-form-nextjs'
import z from 'zod'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/utils'

import { authFormOptions, authSchema } from './auth-validation'

import type { Provider } from '@supabase/supabase-js'

type Auth = z.infer<typeof authSchema>

export async function registerWithEmail(prevState: unknown, formData: FormData) {
	const headerList = await headers()
	const supabase = await createClient()

	const origin = headerList.get('origin')

	const serverValidate = createServerValidate({
		...authFormOptions,
		onServerValidate: authSchema,
	})

	let email: Auth['email']

	try {
		const validatedData = await serverValidate(formData)
		const response = await supabase.auth.signUp({
			email: validatedData.email,
			password: validatedData.password,
			options: {
				emailRedirectTo: `${origin}/dashboard`,
			},
		})

		if (response.error !== null) {
			throw response.error!
		}

		email = validatedData.email
	} catch (error: unknown) {
		if (error instanceof ServerValidateError) {
			return error.formState
		}

		throw error
	}

	return redirect(`/register/verify-email?email=${email}`)
}

export async function resendEmailRegistration(prevState: unknown, formData: FormData) {
	const headerList = await headers()
	const supabase = await createClient()

	const origin = headerList.get('origin')

	const serverValidate = createServerValidate({
		defaultValues: { email: '' },
		onServerValidate: authSchema.pick({ email: true }),
	})

	try {
		const validatedData = await serverValidate(formData)
		const response = await supabase.auth.resend({
			email: validatedData.email,
			type: 'signup',
			options: {
				emailRedirectTo: `${origin}/dashboard`,
			},
		})

		if (response.error !== null) {
			throw response.error!
		}
	} catch (error: unknown) {
		if (error instanceof ServerValidateError) {
			return error.formState
		}

		throw error
	}
}

export async function logInWithEmail(prevState: unknown, formData: FormData) {
	const headerList = await headers()
	const supabase = await createClient()

	const origin = headerList.get('origin')

	const serverValidate = createServerValidate({
		...authFormOptions,
		onServerValidate: authSchema,
	})

	try {
		const validatedData = await serverValidate(formData)
		const response = await supabase.auth.signInWithPassword({
			email: validatedData.email,
			password: validatedData.password,
		})

		if (response.error !== null) {
			throw response.error!
		}
	} catch (error: unknown) {
		if (error instanceof ServerValidateError) {
			return error.formState
		}

		throw error
	}

	return redirect(`${origin}/dashboard`)
}

export async function resetPasswordForEmail(prevState: unknown, formData: FormData) {
	const headerList = await headers()
	const supabase = await createClient()

	const origin = headerList.get('origin')

	const serverValidate = createServerValidate({
		defaultValues: { email: '' },
		onServerValidate: authSchema.pick({ email: true }),
	})

	try {
		const validatedData = await serverValidate(formData)
		const response = await supabase.auth.resetPasswordForEmail(validatedData.email, {
			redirectTo: `${origin}/update-password`,
		})

		if (response.error !== null) {
			throw response.error!
		}
	} catch (error: unknown) {
		if (error instanceof ServerValidateError) {
			return error.formState
		}

		throw error
	}
}

export async function updatePassword(prevState: unknown, formData: FormData) {
	const headerList = await headers()
	const supabase = await createClient()

	const origin = headerList.get('origin')

	const serverValidate = createServerValidate({
		defaultValues: { password: '' },
		onServerValidate: authSchema.pick({ password: true }),
	})

	try {
		const validatedData = await serverValidate(formData)
		const response = await supabase.auth.updateUser({ password: validatedData.password })

		if (response.error !== null) {
			throw response.error!
		}
	} catch (error: unknown) {
		if (error instanceof ServerValidateError) {
			return error.formState
		}

		throw error
	}

	return redirect(`${origin}/dashboard`)
}

export async function logInWithOAuth(provider: Provider) {
	const headerList = await headers()
	const supabase = await createClient()

	const origin = headerList.get('origin')

	let redirectUrl = ''

	try {
		const response = await supabase.auth.signInWithOAuth({
			provider: provider,
			options: {
				redirectTo: `${origin}/auth/callback`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent',
				},
			},
		})

		if (response.error !== null) {
			throw response.error!
		}

		if (response.data.url) {
			redirectUrl = response.data.url
		}
	} catch (error: unknown) {
		return {
			error: getErrorMessage(error),
		}
	}

	return redirect(redirectUrl)
}

export async function logOut() {
	const supabase = await createClient()

	try {
		const response = await supabase.auth.signOut()

		if (response.error !== null) {
			throw response.error!
		}
	} catch (error: unknown) {
		return {
			error: getErrorMessage(error),
		}
	}

	return redirect('/login')
}
