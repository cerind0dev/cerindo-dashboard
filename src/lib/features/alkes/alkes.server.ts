import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

import { alkesCache } from './alkes-cache'
import { getAlkesQuery } from './alkes-fetchers'

export async function getAuthenticatedAlkesClient() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getClaims()

	if (error || !data?.claims) {
		throw new Error('You must be signed in to access Alkes data.')
	}

	return supabase
}

export async function getAlkesSnapshot() {
	'use cache: private'

	cacheLife({ stale: 60 })
	cacheTag(alkesCache.tag)

	const supabase = await getAuthenticatedAlkesClient()
	const { data, error } = await getAlkesQuery(supabase)

	if (error) throw new Error(error.message)

	return { data, updatedAt: Date.now() }
}
