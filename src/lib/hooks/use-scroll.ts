'use client'

import { useSyncExternalStore } from 'react'

export function useScroll(threshold: number) {
	const subscribe = (callback: () => void) => {
		window.addEventListener('scroll', callback)
		return () => window.removeEventListener('scroll', callback)
	}

	const getSnapshot = () => window.scrollY > threshold
	const getServerSnapshot = () => false

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
