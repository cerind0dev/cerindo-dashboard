import { NextResponse } from 'next/server'

import { env } from '@/env'
import { createServerClient } from '@supabase/ssr'

import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard']
const PUBLIC_ROUTES = ['/', '/tracking', '/login', '/register', '/forgot-password']

export async function updateSession(request: NextRequest) {
	const path = request.nextUrl.pathname
	const isProtectedRoute = PROTECTED_ROUTES.includes(path)
	const isPublicRoute = PUBLIC_ROUTES.includes(path) || request.nextUrl.pathname.startsWith('/api/public')

	let supabaseResponse = NextResponse.next({
		request,
	})

	let supabaseURL
	let supabasePublishableKey

	if (env.NODE_ENV === 'development') {
		supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL_LOCAL!
		supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LOCAL!
	} else {
		supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL!
		supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
	}

	if (!supabaseURL || !supabasePublishableKey) {
		return supabaseResponse
	}

	const supabase = createServerClient(supabaseURL, supabasePublishableKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll()
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => {
					return request.cookies.set(name, value)
				})
				supabaseResponse = NextResponse.next({ request })
				cookiesToSet.forEach(({ name, value, options }) => {
					return supabaseResponse.cookies.set(name, value, options)
				})
			},
		},
	})

	const { data } = await supabase.auth.getClaims()
	const user = data?.claims

	// Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !user) {
		return NextResponse.redirect(new URL('/login', request.nextUrl))
	}

	// Redirect to /dashboard if the user is authenticated
	if (isPublicRoute && user && !request.nextUrl.pathname.startsWith('/dashboard')) {
		return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
	}

	// if (!isPublicRoute && !user) {
	// 	// no user, potentially respond by redirecting the user to the login page
	// 	const url = request.nextUrl.clone()
	// 	url.pathname = '/login'
	// 	return NextResponse.redirect(url)
	// }

	return supabaseResponse
}
