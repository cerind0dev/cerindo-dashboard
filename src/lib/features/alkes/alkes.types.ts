import { getAlkesItemsByTypeQuery } from '@/lib/features/alkes/alkes-fetchers'

import type { QueryData } from '@supabase/supabase-js'

export type AlkesItemsByType = QueryData<ReturnType<typeof getAlkesItemsByTypeQuery>>
export type AlkesItem = AlkesItemsByType[number]
export type AlkesItemType = AlkesItem['type']
export type Alkes = Pick<AlkesItem['alkes'], 'id' | 'creation_date' | 'expiry_date' | 'file_url'>
