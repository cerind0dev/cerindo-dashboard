import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

import { env } from '@/env'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url)

	// if "next" is in param, use it as the redirect URL
	let next = searchParams.get('next') ?? '/'

	if (!next.startsWith('/')) {
		next = '/'
	}

	const code = searchParams.get('code')

	if (code) {
		const supabase = await createClient()
		const response = await supabase.auth.exchangeCodeForSession(code)

		if (!response.error) {
			const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
			const isLocalEnvironment = env.NODE_ENV === 'development'

			if (isLocalEnvironment) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`)
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`)
			} else {
				return NextResponse.redirect(`${origin}${next}`)
			}
		} else {
			redirect(`/auth/error?error=${response.error?.message}`)
		}
	}

	redirect(`/auth/error?error=No token hash or type`)
}
