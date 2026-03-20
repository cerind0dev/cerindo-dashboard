import React from 'react'

import { rubik } from '@/config/font'

export default function SiteFooter() {
	return (
		<footer className="mt-auto w-full">
			<div className="border-t border-secondary-foreground/10 bg-background/95 py-4 text-center text-sm text-background">
				<p className={`${rubik.className} font-light text-primary`}>&#169; 2026 Cerindo</p>
			</div>
		</footer>
	)
}
