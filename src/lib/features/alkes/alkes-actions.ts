'use server'

import { updateTag } from 'next/cache'

import { alkesCacheKey } from './alkes-cache-key'
import { createAlkesMutation, deleteAlkesMutation, updateAlkesMutation } from './alkes-mutations'
import { getAuthenticatedAlkesClient } from './alkes-server'
import { alkesIdSchema, createAlkesPayloadSchema, udpateAlkesPayloadSchema } from './alkes-validation'

import type { CreateAlkesPayload } from './alkes-validation'

export async function createAlkesAction(payload: CreateAlkesPayload) {
	const supabase = await getAuthenticatedAlkesClient()
	const { error } = await createAlkesMutation(supabase, createAlkesPayloadSchema.parse(payload))

	if (error) throw new Error(error.message)
	updateTag(alkesCacheKey.tag)
}

export async function updateAlkesAction(id: string, payload: unknown) {
	const supabase = await getAuthenticatedAlkesClient()
	const { error } = await updateAlkesMutation(
		supabase,
		alkesIdSchema.parse(id),
		udpateAlkesPayloadSchema.parse(payload),
	)

	if (error) throw new Error(error.message)
	updateTag(alkesCacheKey.tag)
}

export async function deleteAlkesAction(id: string) {
	const supabase = await getAuthenticatedAlkesClient()
	const { error } = await deleteAlkesMutation(supabase, alkesIdSchema.parse(id))

	if (error) throw new Error(error.message)
	updateTag(alkesCacheKey.tag)
}
