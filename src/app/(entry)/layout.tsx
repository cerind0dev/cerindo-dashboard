import React from 'react'

import SiteFooter from '@/components/layouts/site-footer'
import SiteHeader from '@/components/layouts/site-header'

type EntryLayoutProps = {
	children: React.ReactNode
}

export default async function EntryLayout({ children }: EntryLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex flex-1 flex-col items-center justify-center">{children}</main>
			<SiteFooter />
		</div>
	)
}
