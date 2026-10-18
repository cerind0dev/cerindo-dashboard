import { formOptions } from '@tanstack/react-form-nextjs'
import z from 'zod'

export const nokiaShipmentSchema = z
	.object({
		shipperCountry: z.string().trim().min(1, { error: 'You have to choose one of the countries' }),
		shipmentFile: z
			.file({ error: 'You have to provide the shipment file' })
			.mime(['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], {
				error: 'Shipment file have to be a .pdf or .xlsx file',
			})
			.optional()
			.nullable()
			.default(null),
		totalDataRows: z.coerce.number().optional(),
	})
	.refine((data) => data.shipperCountry !== 'india' || data.totalDataRows !== undefined, {
		error: 'Please enter the total amount of the items',
		path: ['totalDataRows'],
	})

export const nokiaShipmentFormOptions = formOptions({
	defaultValues: {
		shipperCountry: 'hungary',
		shipmentFile: null as File | null,
		totalDataRows: undefined as number | undefined,
	},
})
