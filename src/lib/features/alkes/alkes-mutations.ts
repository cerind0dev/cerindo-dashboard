import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Alkes, AlkesItem } from './alkes.types'

export function createAlkesMutation(
	client: SupabaseClient<Database>,
	payload: Database['public']['Tables']['alkes']['Insert'],
) {
	return client.from('alkes').insert(payload)
}

export function createAlkesItemMutation(
	client: SupabaseClient<Database>,
	payload: Database['public']['Tables']['alkes_items']['Insert'],
) {
	return client.from('alkes_items').insert(payload)
}

export function updateAlkesMutation(
	client: SupabaseClient<Database>,
	id: Alkes['id'],
	payload: Database['public']['Tables']['alkes']['Update'],
) {
	return client.from('alkes').update(payload).eq('id', id)
}

export function updateAlkesItemMutation(
	client: SupabaseClient<Database>,
	id: AlkesItem['id'],
	payload: Database['public']['Tables']['alkes_items']['Update'],
) {
	return client.from('alkes_items').update(payload).eq('id', id).select()
}

export function deleteAlkesMutation(client: SupabaseClient<Database>, id: Alkes['id']) {
	return client.from('alkes').delete().eq('id', id)
}

export function deleteAlkesItemMutation(client: SupabaseClient<Database>, id: AlkesItem['id']) {
	return client.from('alkes_items').delete().eq('id', id)
}
