import { createStore } from 'zustand/vanilla'

import type { Session, User } from '@supabase/supabase-js'

export type AuthState = {
	session: Session | null
	user: User | null
}

export type AuthActions = {
	setAuth: (session: AuthState['session']) => void
	clearAuth: () => void
}

export type AuthStore = AuthState & AuthActions

export const defaultInitialState: AuthState = {
	session: null,
	user: null,
}

export const createAuthStore = (initialState: AuthState = defaultInitialState) => {
	return createStore<AuthStore>()((set) => {
		return {
			...initialState,
			setAuth: (session) => set({ session: session, user: session?.user ?? null }),
			clearAuth: () => set(initialState),
		}
	})
}
