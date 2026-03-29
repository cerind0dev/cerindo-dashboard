'use client'

import React, { createContext, useContext, useState } from 'react'

import { useStore } from 'zustand'

import { createAlkesStore } from '@/lib/features/alkes/alkes-store'

import type { AlkesStore } from '@/lib/features/alkes/alkes-store'
import type { Alkes } from '@/lib/features/alkes/alkes.types'

export type AlkesStoreApi = ReturnType<typeof createAlkesStore>

export const AlkesStoreContext = createContext<AlkesStoreApi | undefined>(undefined)

export interface AlkesStoreProviderProps {
	children: React.ReactNode
}

export const AlkesStoreProvider = ({ children }: AlkesStoreProviderProps) => {
	const [store] = useState(() => createAlkesStore())
	return <AlkesStoreContext.Provider value={store}>{children}</AlkesStoreContext.Provider>
}

const useAlkesStore = <T,>(selector: (store: AlkesStore) => T): T => {
	const alkesStoreContext = useContext(AlkesStoreContext)
	if (!alkesStoreContext) {
		throw new Error(`useAlkesStore must be used within AlkesStoreProvider`)
	}

	return useStore(alkesStoreContext, selector)
}

export const useAlkesActions = () => useAlkesStore((state) => state.actions)
export const useAlkesItems = () => useAlkesStore((state) => state.alkesItems)
export const useDistinctAlkes = (): Alkes[] => {
	const alkesItems = useAlkesItems()
	const map = new Map()

	alkesItems.forEach((item) => {
		if (!map.has(item.alkes.id)) {
			map.set(item.alkes.id, {
				id: item.alkes.id,
				creation_date: item.alkes.creation_date,
				expiry_date: item.alkes.expiry_date,
				file_url: item.alkes.file_url,
			})
		}
	})

	return Array.from(map.values())
}
