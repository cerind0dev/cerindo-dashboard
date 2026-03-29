// @see https://github.com/sadmann7/skateshop/blob/main/src/hooks/use-click-outside.ts

import * as React from 'react'

interface UseClickOutsideProps<T extends HTMLElement> {
	ref: React.RefObject<T | null>
	handler: (event: MouseEvent | TouchEvent) => void
}

export function useClickOutside<T extends HTMLElement>({ ref, handler }: UseClickOutsideProps<T>) {
	React.useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			const el = ref?.current
			if (!el || el.contains((event?.target as Node) || null)) {
				return
			}
			handler(event)
		}
		document.addEventListener('mousedown', listener)
		document.addEventListener('touchstart', listener)
		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [ref, handler])
}
