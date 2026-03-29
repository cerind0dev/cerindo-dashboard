import { env } from '@/env'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import z from 'zod'

import type { ClassValue } from 'clsx'

export function absoluteUrl(path: string) {
	return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
	let message: string

	if (error instanceof Error) {
		message = error.message
	} else if (error instanceof z.ZodError) {
		const errors = error.issues.map((issue) => {
			return issue.message
		})

		message = errors.join('\n')
	} else if (error && typeof error === 'object' && 'message' in error) {
		message = String(error.message)
	} else if (typeof error === 'string') {
		message = error
	} else {
		message = 'Something went wrong'
	}

	return message
}

export const formatDate = (dateInput: string | Date): string => {
	const date = new Date(dateInput)
	const formatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	const parts = formatter.formatToParts(date)

	const day = parts.find((p) => p.type === 'day')?.value
	const month = parts.find((p) => p.type === 'month')?.value
	const year = parts.find((p) => p.type === 'year')?.value

	return `${day}-${month}-${year}`
}

