import { queryOptions } from '@tanstack/react-query'

import { createClient as createBrowserClient } from '@/lib/supabase/client'

import { getHscodeQuery } from './hscode-fetchers'

const queryKeys = {
	all: () => ['hscode'] as const,
}

export function getHscodeQueryOptions() {
	const supabase = createBrowserClient()

	return queryOptions({
		queryKey: queryKeys.all(),
		queryFn: async () => {
			const response = await getHscodeQuery(supabase)
			if (response.error) {
				throw response.error
			}

			return response.data
		},
		enabled: false, // don't fetch on mount
		staleTime: Infinity, // ensure it only fetches once until page refresh
	})
}
