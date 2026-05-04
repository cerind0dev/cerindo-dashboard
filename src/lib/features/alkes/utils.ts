import { useQueryState } from 'nuqs'

import { formatDate } from '@/lib/utils/utils'

import type { AlkesItemsByTypeWithCountriesAndHscode } from './alkes.types'

export const useAlkesIdQueryString = () => {
	return useQueryState('alkes-id')
}

export const mapAlkesToExcelRow = (item: AlkesItemsByTypeWithCountriesAndHscode[number], index: number) => ({
	number: index + 1,
	countryCode: item.alkes.countries.code,
	type: item.type,
	alkesItemName: item.name,
	brandName: item.alkes.brand_name,
	packaging: `KEMASAN : ${item.alkes.packaging}`,
	description: item.description,
	hsCode: item.alkes.hscode.code,
	importDutyFees: item.alkes.hscode.import_dutyfees,
	valueAddedTax: item.alkes.hscode.value_added_tax,
	incomeTaxApi: item.alkes.hscode.income_tax_api,
	incomeTaxNonApi: item.alkes.hscode.income_tax_non_api,
	lartas: item.alkes.hscode.lartas,
	facility: item.facility,
	alkesCode: item.alkes.id.replace(/_/g, ' '),
	alkesCreationDate: formatDate(item.alkes.creation_date),
	alkesExpiryDate: formatDate(item.alkes.expiry_date),
})

export const ALKES_WORKSHEETS = [
	{
		name: 'Barang',
		columns: [
			{ header: 'NOMOR', key: 'number' },
			{ header: 'NEGARA ASAL', key: 'countryCode' },
			{ header: 'MEREK', key: 'type' },
			{ header: 'NAMA DAGANG', key: 'brandName' },
			{ header: 'KEMASAN', key: 'packaging' },
			{ header: 'HS CODE', key: 'hsCode' },
			{ header: 'BM', key: 'importDutyFees' },
			{ header: 'PPN', key: 'valueAddedTax' },
			{ header: 'PPH-API', key: 'incomeTaxApi' },
			{ header: 'PPH-NONAPI', key: 'incomeTaxNonApi' },
			{ header: 'LARTAS', key: 'lartas' },
			{ header: 'FASILITAS', key: 'facility' },
			{ header: 'AKL', key: 'alkesCode' },
			{ header: 'TANGGAL TERBIT AKL', key: 'alkesCreationDate' },
			{ header: 'DESKRIPSI DI AKL', key: 'alkesItemName' },
			{ header: 'DESKRIPSI DI INVOICE', key: 'description' },
		],
	},
	{
		name: 'Alkes',
		columns: [
			{ header: 'NOMOR', key: 'number' },
			{ header: 'KODE AKL', key: 'alkesCode' },
			{ header: 'TANGGAL TERBIT AKL', key: 'alkesCreationDate' },
			{ header: 'TANGGAL KADALUARSA AKL', key: 'alkesExpiryDate' },
		],
	},
]
