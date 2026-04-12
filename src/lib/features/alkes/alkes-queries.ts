import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
	deleteAlkesQuery,
	getAlkesByIdQuery,
	getAlkesItemsByAlkesIdQuery,
	getAlkesItemsByTypeQuery,
	getAlkesQuery,
	updateAlkesQuery,
} from '@/lib/features/alkes/alkes-fetchers'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Alkes, AlkesItem, AlkesWithCountriesAndHscode } from './alkes.types'

const queryKeys = {
	all: () => ['alkes'] as const,
	getAlkesById: (id: Alkes['id']) => [...queryKeys.all(), 'by-id', { id }],
	getAlkesItemsByType: (type: AlkesItem['type']) => [...queryKeys.all(), 'items-by-type', { type }],
	getAlkesItemsByAlkesId: (alkesId: Alkes['id']) => [...queryKeys.all(), 'items-by-alkes-id', { alkesId }],
}

export function getAlkesQueryOptions(client: SupabaseClient<Database>) {
	return queryOptions({
		queryKey: queryKeys.all(),
		queryFn: async () => {
			const response = await getAlkesQuery(client)
			if (response.error) {
				throw response.error
			}

			return response.data
		},
	})
}

export function getAlkesByIdQueryOptions(id: Alkes['id']) {
	const supabase = createBrowserClient()

	return queryOptions({
		queryKey: queryKeys.getAlkesById(id),
		queryFn: async () => {
			const response = await getAlkesByIdQuery(supabase, id)
			if (response.error) {
				throw response.error
			}

			return response.data
		},
		enabled: !!id,
		placeholderData: keepPreviousData,
	})
}

export function useUpdateAlkesMutation(id: Alkes['id']) {
	const supabase = createBrowserClient()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (updated: Database['public']['Tables']['alkes']['Update']) => {
			const response = await updateAlkesQuery(supabase, id, updated)
			if (response.error) {
				throw response.error
			}
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.getAlkesById(id) }),
				queryClient.invalidateQueries({ queryKey: queryKeys.all(), exact: false }),
				queryClient.invalidateQueries({ queryKey: queryKeys.getAlkesItemsByAlkesId(id) }),
			])

			toast.success(`${id.split('_').join(' ')} berhasil diperbarui`, { position: 'top-right' })
		},
		onError: (error) => {
			const message = error.message || 'An unexpected error occurred'
			toast.error(`Gagal memperbarui ${id.split('_').join(' ')}: ${message}`, { position: 'top-right' })
		},
	})
}

export function useDeleteAlkesMutation(id: Alkes['id']) {
	const supabase = createBrowserClient()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			const response = await deleteAlkesQuery(supabase, id)
			if (response.error) {
				throw response.error
			}
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queryKeys.all() })

			const previous = queryClient.getQueryData<AlkesWithCountriesAndHscode>(queryKeys.all())
			if (previous) {
				queryClient.setQueryData<AlkesWithCountriesAndHscode>(queryKeys.all(), (old) => {
					return old?.filter((alkes) => alkes.id !== id)
				})
			}

			return { previous }
		},
		onSuccess: () => {
			toast.success(`${id.split('_').join(' ')} berhasil dihapus`, { position: 'top-right' })
		},
		onError: (error, _, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKeys.all(), context.previous)
			}

			const message = error.message || 'An unexpected error occurred'
			toast.error(`Gagal menghapus ${id.split('_').join(' ')}: ${message}`, { position: 'top-right' })
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.all(), exact: false })
			queryClient.removeQueries({ queryKey: queryKeys.getAlkesById(id) })
			queryClient.removeQueries({ queryKey: queryKeys.getAlkesItemsByAlkesId(id) })
		},
	})
}

export function getAlkesItemsByAlkesIdQueryOptions(alkesId: Alkes['id']) {
	const supabase = createBrowserClient()

	return queryOptions({
		queryKey: queryKeys.getAlkesItemsByAlkesId(alkesId),
		queryFn: async () => {
			const response = await getAlkesItemsByAlkesIdQuery(supabase, alkesId)
			if (response.error) {
				throw response.error
			}

			return response.data
		},
		enabled: alkesId.length > 0,
	})
}

export function getAlkesItemsByTypeQueryOptions(type: AlkesItem['type']) {
	const supabase = createBrowserClient()

	return queryOptions({
		queryKey: queryKeys.getAlkesItemsByType(type),
		queryFn: async () => {
			const response = await getAlkesItemsByTypeQuery(supabase, type)
			if (response.error) {
				throw response.error
			}

			return response.data
		},
		enabled: !!type,
	})
}
