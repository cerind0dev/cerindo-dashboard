import { formOptions } from '@tanstack/react-form-nextjs'
import z from 'zod'

import type { AlkesByIdWithCountriesAndHscode, AlkesItemsByAlkesIdWithCountriesAndHscode } from './alkes.types'

function isExpired(creationDate?: string, expiryDate?: string) {
	return !creationDate || !expiryDate || new Date(expiryDate) > new Date(creationDate)
}
const nullableTextSchema = z
	.string()
	.nullable()
	.transform((value) => (value?.trim() === '' ? null : value))

const alkesNumberSchema = z
	.string()
	.trim()
	.min(1, { error: 'A valid alkes number is required' })
	.regex(/^AKL \d+$/, { error: 'Alkes number must follow the format: AKL [numbers] (e.g., AKL 1234567)' })

export const alkesIdSchema = z
	.string()
	.trim()
	.regex(/^AKL_\d+$/, { error: 'Alkes ID must follow the format: AKL_[numbers]' })

const alkesFields = z.object({
	brand_name: nullableTextSchema,
	packaging: nullableTextSchema,
	creation_date: z.iso.datetime({ offset: true, error: "Date of issue of alkes can't be empty" }),
	expiry_date: z.iso.datetime({ offset: true, error: "Alkes expiration date can't be empty" }),
	file_url: z.string().trim().min(1, { error: 'A valid file name is required' }),
	id_country: z.uuid({ error: 'Please select a valid country' }),
	id_hscode: z.uuid({ error: 'Please select a valid HS code' }),
})

export const createAlkesPayloadSchema = alkesFields
	.extend({ id: alkesIdSchema })
	.refine((data) => isExpired(data.creation_date, data.expiry_date), {
		error: 'Expiration date must be after the date of issue',
		path: ['expiry_date'],
	})

export type CreateAlkesPayload = z.input<typeof createAlkesPayloadSchema>

export const createAlkesSchema = z
	.object({
		alkesNumber: alkesNumberSchema,
		brandName: alkesFields.shape.brand_name,
		packaging: alkesFields.shape.packaging,
		creationDate: alkesFields.shape.creation_date,
		expiryDate: alkesFields.shape.expiry_date,
		fileUrl: alkesFields.shape.file_url,
		countryId: alkesFields.shape.id_country,
		hscodeId: alkesFields.shape.id_hscode,
		file: z
			.file({ error: 'You have to provide the alkes file' })
			.max(5_000_000, { error: 'Maximum size of the alkes file is 5 MB' })
			.mime(['application/pdf'], { error: 'Alkes file must be a .pdf file' }),
	})
	.refine((data) => isExpired(data.creationDate, data.expiryDate), {
		error: 'Expiration date must be after the date of issue',
		path: ['expiryDate'],
	})

export const createAlkesFormOptions = formOptions({
	defaultValues: {
		alkesNumber: '',
		brandName: null as string | null,
		packaging: null as string | null,
		creationDate: new Date().toISOString(),
		expiryDate: new Date().toISOString(),
		file: null as File | null,
		fileUrl: '',
		countryId: '',
		hscodeId: '',
	},
})

export const createAlkesItemSchema = z.object({
	type: z.string().trim().min(1, { error: 'A valid item type is required' }),
	name: nullableTextSchema,
	facility: nullableTextSchema,
	description: nullableTextSchema,
})

export const createAlkesItemFormOptions = formOptions({
	defaultValues: {
		type: '',
		name: null as string | null,
		facility: null as string | null,
		description: null as string | null,
	},
})

export const updateAlkesSchema = z
	.object({
		brandName: nullableTextSchema,
		packaging: nullableTextSchema,
		creationDate: z.iso.datetime({ offset: true, error: "Date of issue of alkes can't be empty" }),
		expiryDate: z.iso.datetime({ offset: true, error: "Alkes expiration date can't be empty" }),
		file: z
			.file()
			.max(5_000_000, { error: 'Maximum size of the alkes file is 5 MB' })
			.mime(['application/pdf'], { error: 'Alkes file must be a .pdf file' })
			.nullable(),
		fileUrl: z.string().trim().min(1, { error: 'A valid file name is required' }),
		countryId: z.uuid({ error: 'Please select a valid country' }),
		hscodeId: z.uuid({ error: 'Please select a valid HS code' }),
	})
	.refine((data) => isExpired(data.creationDate, data.expiryDate), {
		error: 'Expiration date must be after the date of issue',
		path: ['expiryDate'],
	})

export const udpateAlkesPayloadSchema = alkesFields
	.partial()
	.refine((data) => Object.keys(data).length > 0, { error: 'Provide at least one field to update.' })
	.refine((data) => isExpired(data.creation_date, data.expiry_date), {
		error: 'Expiration date must be after the date of issue',
		path: ['expiry_date'],
	})

export type UpdateAlkesPayload = z.input<typeof udpateAlkesPayloadSchema>

export const updateAlkesFormOptions = (fromDatabase: AlkesByIdWithCountriesAndHscode) =>
	formOptions({
		defaultValues: {
			brandName: fromDatabase.brand_name,
			packaging: fromDatabase.packaging,
			creationDate: new Date(fromDatabase.creation_date).toISOString(),
			expiryDate: new Date(fromDatabase.expiry_date).toISOString(),
			file: null as File | null,
			fileUrl: fromDatabase.file_url,
			countryId: fromDatabase.countries.id,
			hscodeId: fromDatabase.hscode.id,
		},
	})

export const updateAlkesItemSchema = z.object({
	type: z.string().trim().min(1, { error: 'A valid item type is required' }),
	name: nullableTextSchema,
	facility: nullableTextSchema,
	description: nullableTextSchema,
})

export const updateAlkesItemFormOptions = (
	fromDatabase: Pick<AlkesItemsByAlkesIdWithCountriesAndHscode[number], 'type' | 'name' | 'facility' | 'description'>,
) =>
	formOptions({
		defaultValues: {
			type: fromDatabase.type,
			name: fromDatabase.name,
			facility: fromDatabase.facility,
			description: fromDatabase.description,
		},
	})
