import { queryOptions } from '@tanstack/react-query'

import { createClient as createBrowserClient } from '@/lib/supabase/client'

import { getCountriesQuery } from './countries-fetchers'

const queryKeys = {
	all: () => ['countries'] as const,
}

export function getCountriesQueryOptions() {
	const supabase = createBrowserClient()

	return queryOptions({
		queryKey: queryKeys.all(),
		queryFn: async () => {
			const response = await getCountriesQuery(supabase)
			if (response.error) {
				throw response.error
			}

			return response.data
		},
		enabled: false, // don't fetch on mount
		staleTime: Infinity, // ensure it only fetches once until page refresh
	})
}
