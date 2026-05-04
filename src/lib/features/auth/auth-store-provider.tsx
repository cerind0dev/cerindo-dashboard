'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { useStore } from 'zustand'

import { createClient } from '@/lib/supabase/client'

import { createAuthStore } from './auth-store'

import type { AuthStore } from './auth-store'

export type AuthStoreApi = ReturnType<typeof createAuthStore>

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(undefined)

export interface AuthStoreProviderProps {
	children: React.ReactNode
}

export const AuthStoreProvider = ({ children }: AuthStoreProviderProps) => {
	const [store] = useState(() => createAuthStore())

	const supabase = useMemo(() => createClient(), [])
	const pathname = usePathname()

	useEffect(() => {
		// sync initial session if it exists
		const setAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			store.getState().setAuth(session)
		}

		setAuth()

		// listen for auth changes
		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (_event === 'SIGNED_IN') {
				store.getState().setAuth(session)
			} else if (_event === 'SIGNED_OUT') {
				store.getState().clearAuth()
			}
		})

		return () => listener?.subscription.unsubscribe()
	}, [supabase, store])

	// manually refresh session since onAuthStateChange won't fire
	useEffect(() => {
		const refreshSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			const currentState = store.getState()

			// only update if session changed
			if (currentState.session?.user?.id !== session?.user?.id) {
				if (session) {
					store.getState().setAuth(session)
				} else {
					store.getState().clearAuth()
				}
			}
		}

		refreshSession()
	}, [pathname, supabase, store])

	return <AuthStoreContext.Provider value={store}>{children}</AuthStoreContext.Provider>
}

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
	const authStoreContext = useContext(AuthStoreContext)

	if (!authStoreContext) {
		throw new Error(`useAuthStore must be used within AuthStoreProvider`)
	}

	return useStore(authStoreContext, selector)
}

export const useUser = () => useAuthStore((state) => state.user)
export const useSession = () => useAuthStore((state) => state.session)
