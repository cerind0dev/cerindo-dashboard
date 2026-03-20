import { formOptions } from '@tanstack/react-form-nextjs'
import z from 'zod'

function hasUppercaseLetter(value: string) {
	return /[A-Z]/.test(value)
}

function hasLowercaseLetter(value: string) {
	return /[a-z]/.test(value)
}

function hasNumber(value: string) {
	return /[0-9]/.test(value)
}

function hasSpecialCharacter(value: string) {
	return /[!@#$%^&*]/.test(value)
}

export const authSchema = z.object({
	email: z.email({ error: 'Please enter a valid email address' }),
	password: z
		.string()
		.min(8, { error: 'Password must be at least 8 characters long' })
		.refine((value) => hasUppercaseLetter(value), {
			message: 'Password must contain at least one uppercase letter',
		})
		.refine((value) => hasLowercaseLetter(value), {
			message: 'Password must contain at least one lowercase letter',
		})
		.refine((value) => hasNumber(value), {
			message: 'Password must contain at least one number',
		})
		.refine((value) => hasSpecialCharacter(value), {
			message: 'Password must contain at least one special character',
		}),
})

export const authFormOptions = formOptions({
	defaultValues: {
		email: '',
		password: '',
	},
})
