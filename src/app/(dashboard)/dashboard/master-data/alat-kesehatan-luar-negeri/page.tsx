import React from 'react'

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { getAlkesQueryOptions } from '@/lib/features/alkes/alkes-queries'
import { createClient } from '@/lib/supabase/server'

import AlkesPageContainer from './_components/alkes-page-container'

export default async function MasterDataAlkesPage() {
	const queryClient = new QueryClient()
	const supabase = await createClient()

	await queryClient.prefetchQuery(getAlkesQueryOptions(supabase))

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AlkesPageContainer />
		</HydrationBoundary>
	)
}
