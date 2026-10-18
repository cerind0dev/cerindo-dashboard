'use client'

import { createContext, useContext, useState } from 'react'

import { useStore } from 'zustand'

import { createNokiaStore } from './nokia-store'

import type { NokiaStore } from './nokia-store'

export type NokiaStoreApi = ReturnType<typeof createNokiaStore>

export const NokiaStoreContext = createContext<NokiaStoreApi | undefined>(undefined)

export interface NokiaStoreProviderProps {
	children: React.ReactNode
}

export const NokiaStoreProvider = ({ children }: NokiaStoreProviderProps) => {
	const [store] = useState(() => createNokiaStore())
	return <NokiaStoreContext.Provider value={store}>{children}</NokiaStoreContext.Provider>
}

const useNokiaStore = <T,>(selector: (store: NokiaStore) => T): T => {
	const nokiaStoreContext = useContext(NokiaStoreContext)
	if (!nokiaStoreContext) {
		throw new Error(`useNokiaStore must be used within NokiaStoreProvider`)
	}

	return useStore(nokiaStoreContext, selector)
}

export const useNokiaActions = () => useNokiaStore((state) => state.actions)
export const useNokiaShipment = () => useNokiaStore((state) => state.nokiaShipment)
