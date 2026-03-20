'use client'

import React from 'react'

import { useScroll } from '@/lib/hooks/use-scroll'
import { cn } from '@/lib/utils'

import Logo from '@/components/logo'
import UserAccountNavigation from '@/components/user-account-navigation'

export default function SiteHeader() {
	const scrolled = useScroll(10)

	return (
		<header
			className={cn('sticky top-0 z-40 w-full border-b border-transparent bg-background', {
				'border-secondary-foreground/10 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50':
					scrolled,
			})}
		>
			<div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Logo priority="high" />
				<UserAccountNavigation />
			</div>
		</header>
	)
}
