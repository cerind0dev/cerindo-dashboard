import type { Database, Tables } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getAlkesItemsByTypeQuery(client: SupabaseClient<Database>, type: Tables<'alkes_items'>['type']) {
	return client
		.from('alkes_items')
		.select(
			`id, name, type, facility, description, 
        alkes ( 
        id, brand_name, packaging, creation_date, expiry_date, file_url,
        countries (
          code, name
        ),
        hscode (
          code, import_dutyfees, value_added_tax, income_tax_api, income_tax_non_api, lartas
        )
      )`,
		)
		.eq('type', type)
}
