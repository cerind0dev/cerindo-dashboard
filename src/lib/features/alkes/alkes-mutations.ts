import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Alkes, AlkesItem } from './alkes.types'

export function createAlkesQuery(
	client: SupabaseClient<Database>,
	payload: Database['public']['Tables']['alkes']['Insert'],
) {
	return client.from('alkes').insert(payload)
}

export function updateAlkesQuery(
	client: SupabaseClient<Database>,
	id: Alkes['id'],
	payload: Database['public']['Tables']['alkes']['Update'],
) {
	return client.from('alkes').update(payload).eq('id', id)
}

export function deleteAlkesQuery(client: SupabaseClient<Database>, id: Alkes['id']) {
	return client.from('alkes').delete().eq('id', id)
}

export function deleteAlkesItemQuery(client: SupabaseClient<Database>, id: AlkesItem['id']) {
	return client.from('alkes_items').delete().eq('id', id)
}
