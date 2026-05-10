import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createClient as createBrowserClient } from '@/lib/supabase/client'

import {
	getAlkesByIdQuery,
	getAlkesItemsByAlkesIdQuery,
	getAlkesItemsByTypeQuery,
	getAlkesQuery,
} from './alkes-fetchers'
import {
	createAlkesItemMutation,
	createAlkesMutation,
	deleteAlkesItemMutation,
	deleteAlkesMutation,
	updateAlkesMutation,
} from './alkes-mutations'

import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
	Alkes,
	AlkesItem,
	AlkesItemsByAlkesIdWithCountriesAndHscode,
	AlkesWithCountriesAndHscode,
} from './alkes.types'

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

export function useCreateAlkesMutation() {
	const supabase = createBrowserClient()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (alkes: Database['public']['Tables']['alkes']['Insert']) => {
			const response = await createAlkesMutation(supabase, alkes)
			if (response.error) {
				throw response.error
			}
		},
		onSuccess: () => {
			toast.success('Alkes berhasil ditambahkan', { position: 'top-right' })
		},
		onError: () => {
			toast.success('Gagal menambahkan alkes', { position: 'top-right' })
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: queryKeys.all(),
				exact: false,
			})
		},
	})
}

export function useCreateAlkesItemMutation() {
	const supabase = createBrowserClient()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (alkesItem: Database['public']['Tables']['alkes_items']['Insert']) => {
			const response = await createAlkesItemMutation(supabase, alkesItem)
			if (response.error) {
				throw response.error
			}
		},
		onSuccess: () => {
			toast.success('Item alkes berhasil ditambahkan', { position: 'top-right' })
		},
		onError: () => {
			toast.success('Gagal menambahkan item alkes', { position: 'top-right' })
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: queryKeys.all(),
				exact: false,
			})
		},
	})
}

export function useUpdateAlkesMutation(id: Alkes['id']) {
	const supabase = createBrowserClient()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (updated: Database['public']['Tables']['alkes']['Update']) => {
			const response = await updateAlkesMutation(supabase, id, updated)
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
			const response = await deleteAlkesMutation(supabase, id)
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

export function useDeleteAlkesItemMutation(id: AlkesItem['id']) {
	const supabase = createBrowserClient()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			const response = await deleteAlkesItemMutation(supabase, id)
			if (response.error) {
				throw response.error
			}
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queryKeys.all() })

			const previous = queryClient.getQueryData<AlkesItemsByAlkesIdWithCountriesAndHscode>(queryKeys.all())
			if (previous) {
				queryClient.setQueryData<AlkesItemsByAlkesIdWithCountriesAndHscode>(queryKeys.all(), (old) => {
					return old?.filter((alkesItem) => alkesItem.id !== id)
				})
			}

			return { previous }
		},
		onSuccess: () => {
			toast.success(`Item ${id.split('_')[0]} berhasil dihapus`, { position: 'top-right' })
		},
		onError: (error, _, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKeys.all(), context.previous)
			}

			const message = error.message || 'An unexpected error occurred'
			toast.error(`Gagal menghapus item ${id.split('_')[0]}: ${message}`, { position: 'top-right' })
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.all(), exact: false })
			queryClient.removeQueries({ queryKey: queryKeys.getAlkesById(id) })
			queryClient.removeQueries({ queryKey: queryKeys.getAlkesItemsByAlkesId(id) })
		},
	})
}

export async function deleteAlkesFile(client: SupabaseClient<Database>, alkesFileName: string) {
	try {
		const response = await client.storage.from('cerindo').remove([`alkes/${alkesFileName}`])

		if (response.error) {
			throw response.error
		}
	} catch (error: unknown) {
		throw error
	}
}

export async function uploadAlkesFile(client: SupabaseClient<Database>, alkesFile: File) {
	try {
		const signedUploadUrlResponse = await client.storage
			.from('cerindo')
			.createSignedUploadUrl(`alkes/${alkesFile.name}`)

		if (signedUploadUrlResponse.error) {
			throw signedUploadUrlResponse.error
		}

		const fileUploadResponse = await client.storage
			.from('cerindo')
			.uploadToSignedUrl(`alkes/${alkesFile.name}`, signedUploadUrlResponse.data.token, alkesFile)

		if (fileUploadResponse.error) {
			throw fileUploadResponse.error
		}

		return {
			path: fileUploadResponse.data.path,
			name: alkesFile.name,
		}
	} catch (error: unknown) {
		throw error
	}
}
