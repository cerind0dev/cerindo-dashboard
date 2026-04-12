'use client'

import React, { useState } from 'react'

import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
	children: React.ReactNode
}

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute, above 0 to avoid refetching immediately on the client
				refetchOnWindowFocus: false,
				retry: 1,
				refetchOnMount: false,
			},
		},
	})
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
	if (environmentManager.isServer()) {
		return makeQueryClient()
	} else {
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient()
		}

		return browserQueryClient
	}
}

export default function QueryProvider({ children }: QueryProviderProps) {
	const queryClient = getQueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" /> */}
		</QueryClientProvider>
	)
}
