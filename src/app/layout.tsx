import '@/styles/index.css'

import React from 'react'
import { Metadata, Viewport } from 'next'

import { env } from '@/env'

import { inter } from '@/config/font'
import { siteConfig } from '@/config/site'
import { AuthStoreProvider } from '@/lib/providers/auth-store-provider'
import { absoluteUrl } from '@/lib/utils'

import { Toaster } from '@/components/ui/sonner'

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' },
	],
	width: 'device-width',
	initialScale: 1,
}

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		'cerindo',
		'cerindo prima logistik',
		'cerinto transport logistik',
		'freight forwarder',
		'import',
		'export',
		'perusahaan pengurusan jasa kepabeanan',
		'kepabeanan',
		'cukai',
		'logistics',
		'logistik',
		'supply chain',
		'rantai pasok',
		'shipping',
		'pengiriman',
		'freight',
		'pengangkutan barang',
		'warehousing',
		'pergudangan',
		'distribution',
		'distribusi',
		'inventory management',
		'manajemen inventaris',
		'global trade',
		'perdagangan global',
		'customs clearance',
		'bea cukai',
	],
	authors: [
		{
			name: 'cerind0dev',
			url: 'https://github.com/cerind0dev',
		},
	],
	creator: 'cerind0dev',
	openGraph: {
		type: 'website',
		locale: 'in_ID',
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	icons: {
		icon: '/favicon.ico',
		apple: '/apple-touch-icon.png',
	},
	manifest: absoluteUrl('/site.webmanifest'),
}

type RootLayoutProps = {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className={`${inter.className} h-full scroll-smooth`}>
			<head />
			<body className="h-full overscroll-none bg-background text-secondary-foreground">
				<AuthStoreProvider>{children}</AuthStoreProvider>
				<Toaster />
			</body>
		</html>
	)
}

