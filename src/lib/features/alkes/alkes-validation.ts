import { formOptions } from '@tanstack/react-form-nextjs'
import z from 'zod'

import { AlkesByIdWithCountriesAndHscode } from './alkes.types'

function isExpired(creationDate: string, expiryDate: string) {
	return new Date(expiryDate) > new Date(creationDate)
}

export const createAlkesSchema = z.object({
	alkesNumber: z
		.string({ error: 'A valid alkes number is required' })
		.regex(/^AKL \d+$/, { error: 'Alkes number must follow the format: AKL [numbers] (e.g., AKL 1234567)' }),
	brandName: z.string().nullable(),
	packaging: z.string().nullable(),
	creationDate: z.iso.datetime({ offset: true, error: "Date of issue of alkes can't be empty" }),
	expiryDate: z.iso.datetime({ offset: true, error: "Alkes expiration date can't be empty" }),
	file: z
		.file()
		.max(5_000_000, { error: 'Maximum size of the alkes file is 5 MB' })
		.mime(['application/pdf'], { error: 'Alkes file must be a .pdf file' })
		.nullable(),
	fileUrl: z.string({ error: 'A valid file name is required' }),
	countryId: z.uuid({ error: 'Please select a valid country' }),
	hscodeId: z.uuid({ error: 'Please select a valid HS code' }),
})

export const createAlkesFormOptions = formOptions({
	defaultValues: {
		alkesNumber: '',
		brandName: '',
		packaging: '',
		creationDate: new Date().toISOString(),
		expiryDate: new Date().toISOString(),
		file: null as File | null,
		fileUrl: '',
		countryId: '',
		hscodeId: '',
	},
})

export const updateAlkesSchema = z
	.object({
		brandName: z.string().nullable(),
		packaging: z.string().nullable(),
		creationDate: z.iso.datetime({ offset: true, error: "Date of issue of alkes can't be empty" }),
		expiryDate: z.iso.datetime({ offset: true, error: "Alkes expiration date can't be empty" }),
		file: z
			.file()
			.max(5_000_000, { error: 'Maximum size of the alkes file is 5 MB' })
			.mime(['application/pdf'], { error: 'Alkes file must be a .pdf file' })
			.nullable(),
		fileUrl: z.string({ error: 'A valid file name is required' }),
		countryId: z.uuid({ error: 'Please select a valid country' }),
		hscodeId: z.uuid({ error: 'Please select a valid HS code' }),
	})
	.refine((data) => isExpired(data.creationDate, data.expiryDate), {
		error: 'Expiration date must be after the date of issue',
		path: ['expiryDate'],
	})

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
