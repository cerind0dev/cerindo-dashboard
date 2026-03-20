import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import Icons from '@/components/icons'
import LoginForm from '@/app/(authentication)/_components/forms/login-form'

export default async function LoginPage() {
	const supabase = await createClient()
	const response = await supabase.auth.getClaims()

	if (response.error === null && response.data?.claims) {
		redirect('/dashboard')
	}

	return (
		<section className="container mx-auto flex h-full max-w-lg flex-col items-start justify-center rounded-lg px-0">
			<div className="inline-flex flex-col items-start">
				<Link href="/" className="mb-4 inline-flex items-center text-sm hover:underline hover:underline-offset-4">
					<Icons.arrowLeft className="mr-2 size-5 text-secondary-foreground" />
					Go back to homepage
				</Link>
			</div>
			<div className="w-full">
				<LoginForm />
			</div>
		</section>
	)
}
