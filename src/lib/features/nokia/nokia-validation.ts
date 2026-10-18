import { formOptions } from '@tanstack/react-form-nextjs'
import z from 'zod'

export const nokiaShipmentSchema = z.object({
	shipperCountry: z.string().trim().min(1, { error: 'You have to choose one of the countries' }),
	shipmentFile: z
		.file({ error: 'You have to provide the shipment file' })
		.mime(['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], {
			error: 'Shipment file have to be a .pdf or .xlsx file',
		})
		.nullable()
		.refine((file) => file !== null, {
			error: 'You have to provide the shipment file',
		}),
	totalDataRows: z.coerce
		.number<number>({ error: 'You have to specify the number of the item' })
		.int({ error: 'The number of items must be a whole number' })
		.positive()
		.min(1, { error: 'The number of items must be at least 1' }),
})

export const nokiaShipmentFormOptions = formOptions({
	defaultValues: {
		shipperCountry: 'hungary',
		shipmentFile: null as File | null,
		totalDataRows: 1,
	},
})
