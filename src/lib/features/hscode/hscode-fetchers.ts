import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getHscodeQuery(client: SupabaseClient<Database>) {
	return client.from('hscode').select(`id, code`)
}
