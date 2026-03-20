import React from 'react'
import Image from 'next/image'

type AuthLayoutProps = {
	children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="grid flex-1 grid-cols-1 items-center justify-items-center md:grid-cols-2 md:items-stretch md:justify-items-stretch">
				<div className="static col-span-full row-span-full md:relative md:col-span-1">
					<Image
						src="/images/sites/background/blue_container_door.webp"
						alt="blue shipping container door"
						fill
						priority
						sizes="(min-width: 768px) 50vw, 100vw"
						className="aspect-video object-cover"
					/>
				</div>
				<main className="z-40 col-span-full row-span-full container md:col-span-1">{children}</main>
			</div>
		</div>
	)
}
