import { queryOptions } from '@tanstack/react-query'

import { getAlkesItemsByTypeQuery } from '@/lib/features/alkes/alkes-fetchers'
import { createClient } from '@/lib/supabase/client'

import type { AlkesItemType } from '@/lib/features/alkes/alkes.types'

const queryKeys = {
	all: () => ['alkes'] as const, // this to ensure that every query for this feature starts with ['alkes']?
	getContactBytype: (type: AlkesItemType) => [...queryKeys.all(), 'by-type', { type }],
}

export function getAlkesItemsByTypeQueryOptions(type: AlkesItemType) {
	const supabase = createClient()

	return queryOptions({
		queryKey: queryKeys.getContactBytype(type),
		queryFn: async () => {
			const response = await getAlkesItemsByTypeQuery(supabase, type)
			if (response.error) {
				throw response.error
			}

			return response.data
		},
		enabled: type.length > 0, // prevent firing when the query value is empty
	})
}
