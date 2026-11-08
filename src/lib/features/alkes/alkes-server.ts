import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

import { alkesCacheKey } from './alkes-cache-key'
import { getAlkesQuery } from './alkes-fetchers'

import type { AlkesWithCountriesAndHscode } from './alkes.types'

export async function getAuthenticatedAlkesClient() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getClaims()

	if (error || !data?.claims) {
		throw new Error('You must be signed in to access alkes data.')
	}

	return supabase
}

export async function getAlkesSnapshot(): Promise<AlkesWithCountriesAndHscode> {
	'use cache: private'

	cacheLife({ stale: 60 })
	cacheTag(alkesCacheKey.tag)

	const supabase = await getAuthenticatedAlkesClient()
	const { data, error } = await getAlkesQuery(supabase)

	if (error) throw new Error(error.message)

	return data
}
