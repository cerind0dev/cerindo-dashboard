import type { Alkes, AlkesItem } from '@/lib/features/alkes/alkes.types'
import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export function getAlkesQuery(client: SupabaseClient<Database>) {
	return (
		client
			.from('alkes')
			.select(
				`id, brand_name, packaging, creation_date, expiry_date, 
      countries (
        code, name
      ),
      hscode (
        code
      )
    `,
			)
			/**
			 * have to use order clause so the order of the table won't change
			 * because postgre update is a delete followed by an insert
			 */
			.order('id', { ascending: true })
	)
}

export function getAlkesByIdQuery(client: SupabaseClient<Database>, id: Alkes['id']) {
	return client
		.from('alkes')
		.select(
			`id, brand_name, packaging, creation_date, expiry_date, file_url,
      countries (
        id, name
      ),
      hscode (
        id, code
      )
    `,
		)
		.eq('id', id)
		.limit(1)
		.single()
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

export function getAlkesItemsByTypeQuery(client: SupabaseClient<Database>, type: AlkesItem['type']) {
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

export function getAlkesItemsByAlkesIdQuery(client: SupabaseClient<Database>, alkesId: Alkes['id']) {
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
		.eq('id_alkes', alkesId)
}
