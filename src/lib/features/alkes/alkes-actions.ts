'use server'

import { updateTag } from 'next/cache'

import z from 'zod'

import { alkesCache } from './alkes-cache'
import { createAlkesMutation, deleteAlkesMutation, updateAlkesMutation } from './alkes-mutations'
import { getAuthenticatedAlkesClient } from './alkes.server'

const alkesIdSchema = z.string().trim().min(1)
const alkesFieldsSchema = z.object({
	brand_name: z.string().nullable().optional(),
	packaging: z.string().nullable().optional(),
	creation_date: z.iso.datetime({ offset: true }),
	expiry_date: z.iso.datetime({ offset: true }),
	file_url: z.string().trim().min(1),
	id_country: z.uuid(),
	id_hscode: z.uuid(),
})

function hasValidDates(data: { creation_date?: string; expiry_date?: string }) {
	return !data.creation_date || !data.expiry_date || new Date(data.expiry_date) > new Date(data.creation_date)
}

const createSchema = alkesFieldsSchema.extend({ id: alkesIdSchema }).refine(hasValidDates, {
	error: 'Expiration date must be after the date of issue.',
	path: ['expiry_date'],
})
const updateSchema = alkesFieldsSchema
	.partial()
	.refine((data) => Object.keys(data).length > 0, { error: 'Provide at least one field to update.' })
	.refine(hasValidDates, {
		error: 'Expiration date must be after the date of issue.',
		path: ['expiry_date'],
	})

export async function createAlkesAction(payload: unknown) {
	const supabase = await getAuthenticatedAlkesClient()
	const { error } = await createAlkesMutation(supabase, createSchema.parse(payload))

	if (error) throw new Error(error.message)
	updateTag(alkesCache.tag)
}

export async function updateAlkesAction(id: string, payload: unknown) {
	const supabase = await getAuthenticatedAlkesClient()
	const { error } = await updateAlkesMutation(supabase, alkesIdSchema.parse(id), updateSchema.parse(payload))

	if (error) throw new Error(error.message)
	updateTag(alkesCache.tag)
}

export async function deleteAlkesAction(id: string) {
	const supabase = await getAuthenticatedAlkesClient()
	const { error } = await deleteAlkesMutation(supabase, alkesIdSchema.parse(id))

	if (error) throw new Error(error.message)
	updateTag(alkesCache.tag)
}
