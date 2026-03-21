import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {},
	client: {
		NEXT_PUBLIC_APP_URL: z.url(),
		NEXT_PUBLIC_SUPABASE_URL: z.url(),
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_SUPABASE_URL_LOCAL: z.url(),
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LOCAL: z.string(),
	},
	shared: {
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_SUPABASE_URL_LOCAL: process.env.NEXT_PUBLIC_SUPABASE_URL_LOCAL,
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LOCAL: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LOCAL,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
})
