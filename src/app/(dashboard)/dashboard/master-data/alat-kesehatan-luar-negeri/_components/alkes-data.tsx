import { HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { alkesCache } from '@/lib/features/alkes/alkes-cache'
import { getAlkesSnapshot } from '@/lib/features/alkes/alkes.server'

import AlkesPageContainer from './alkes-page-container'

import type { DehydratedState } from '@tanstack/react-query'

export default async function AlkesData() {
	const { data, updatedAt } = await getAlkesSnapshot()
	const queryClient = new QueryClient()
	queryClient.setQueryData(alkesCache.key, data, { updatedAt })

	const state: DehydratedState = {
		mutations: [],
		queries: queryClient
			.getQueryCache()
			.getAll()
			.map((query) => ({
				dehydratedAt: updatedAt,
				queryHash: query.queryHash,
				queryKey: query.queryKey,
				state: query.state,
			})),
	}

	return (
		<HydrationBoundary state={state}>
			<AlkesPageContainer />
		</HydrationBoundary>
	)
}
