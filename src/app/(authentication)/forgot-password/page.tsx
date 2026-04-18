import React from 'react'
import Link from 'next/link'

import Icons from '@/components/icons'

import ForgotPasswordForm from '../_components/forms/forgot-password-form'

export default async function ForgotPasswordPage() {
	return (
		<section className="container mx-auto flex h-full max-w-lg flex-col items-start justify-center rounded-lg px-0">
			<div className="inline-flex flex-col items-start">
				<Link href="/login" className="mb-4 inline-flex items-center text-sm hover:underline hover:underline-offset-4">
					<Icons.arrowLeft className="mr-2 size-5 text-secondary-foreground" />
					Go back to log in page
				</Link>
			</div>
			<div className="w-full">
				<ForgotPasswordForm />
			</div>
		</section>
	)
}
