import React from 'react'

import ResendEmailButton from '../../_components/resend-email-button'

interface VerifyEmailPageProps {
	searchParams: Promise<{ [key: string]: string }>
}

async function RequestResendEmailButton({ searchParams }: VerifyEmailPageProps) {
	const email = (await searchParams).email
	return <ResendEmailButton email={email} />
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
	return (
		<section className="container mx-auto flex h-full max-w-lg flex-col items-start justify-center rounded-lg px-0">
			<div className="w-full">
				<div className="flex flex-col justify-center gap-1">
					<h1 className="text-2xl font-bold">Confirm your account</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Confirmation link has been sent to your email. Please verify your email address to complete your account
						registration
					</p>
				</div>
				<React.Suspense fallback={<div className="h-10" role="status" aria-label="Loading email confirmation" />}>
					<RequestResendEmailButton searchParams={searchParams} />
				</React.Suspense>
			</div>
		</section>
	)
}
