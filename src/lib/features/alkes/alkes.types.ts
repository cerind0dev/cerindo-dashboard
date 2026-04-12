import { getAlkesByIdQuery, getAlkesItemsByTypeQuery, getAlkesQuery } from '@/lib/features/alkes/alkes-fetchers'

import type { Tables } from '@/types/database.types'
import type { QueryData } from '@supabase/supabase-js'

export type Alkes = Tables<'alkes'>
export type AlkesItem = Tables<'alkes_items'>

export type AlkesItemsByTypeWithCountriesAndHscode = QueryData<ReturnType<typeof getAlkesItemsByTypeQuery>>
export type AlkesWithCountriesAndHscode = QueryData<ReturnType<typeof getAlkesQuery>>
export type AlkesByIdWithCountriesAndHscode = QueryData<ReturnType<typeof getAlkesByIdQuery>>
