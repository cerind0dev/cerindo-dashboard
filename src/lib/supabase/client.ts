import { env } from '@/env'
import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/types/database.types'

export function createClient() {
	let supabaseURL
	let supabasePublishableKey

	if (env.NODE_ENV === 'development') {
		supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL_LOCAL!
		supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LOCAL!
	} else {
		supabaseURL = env.NEXT_PUBLIC_SUPABASE_URL!
		supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
	}

	return createBrowserClient<Database>(supabaseURL, supabasePublishableKey)
}
