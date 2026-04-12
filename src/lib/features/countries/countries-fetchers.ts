import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getCountriesQuery(client: SupabaseClient<Database>) {
	return client.from('countries').select(`id, code, name`)
}
