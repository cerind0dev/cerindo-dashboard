import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils/utils'

import logo from '../../public/images/cerindo_bintang_logo.svg'

interface LogoProps {
	loading?: 'lazy' | 'eager'
	priority?: 'auto' | 'high' | 'low'
}

export default function Logo({
	loading: loadingFromProps,
	priority: priorityFromProps,
	className,
	...props
}: LogoProps & React.HTMLAttributes<HTMLAnchorElement>) {
	const loading = loadingFromProps || 'lazy'
	const priority = priorityFromProps || 'low'

	return (
		<Link href="/" className={cn(className)} {...props}>
			<Image
				src={logo}
				className="inline-block h-6 w-auto"
				alt="cerindo logo"
				loading={loading}
				fetchPriority={priority}
			/>
			<span className="sr-only">Home</span>
		</Link>
	)
}
