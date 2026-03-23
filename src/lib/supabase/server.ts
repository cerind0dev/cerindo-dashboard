import { cookies } from 'next/headers'

import { env } from '@/env'
import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/types/database.types'

export async function createClient() {
	const cookieStore = await cookies()

	let supabaseURL
	let supabasePublishableKey

	if (env.NODE_ENV === 'development') {
		supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL_LOCAL!
		supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LOCAL!
	} else {
		supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL!
		supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
	}

	return createServerClient<Database>(supabaseURL, supabasePublishableKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						return cookieStore.set(name, value, options)
					})
				} catch {} // can be ignored because proxy is refreshing user sessions
			},
		},
	})
}
