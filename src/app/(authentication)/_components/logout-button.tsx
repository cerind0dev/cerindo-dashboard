'use client'

import React, { useTransition } from 'react'

import { logOut } from '@/lib/features/auth/auth-action'
import { cn } from '@/lib/utils'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'

export default function LogoutButton({ className, ...props }: React.ComponentProps<typeof Button>) {
	const [isPending, startTransition] = useTransition()

	return (
		<button
			{...props} // props spread will overwrites, the later defined will win
			className={cn(className)}
			disabled={isPending}
			onClick={() => {
				startTransition(async () => {
					await logOut()
				})
			}}
		>
			{isPending ? (
				<Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
			) : (
				<Icons.logout className="size-4" />
			)}
			Log out
		</button>
	)
}
