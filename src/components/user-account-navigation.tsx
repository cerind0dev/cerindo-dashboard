'use client'

import React from 'react'
import Link from 'next/link'

import { useSession } from '@/lib/features/auth/auth-store-provider'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoutButton from '@/app/(authentication)/_components/logout-button'

export default function UserAccountNavigation() {
	const session = useSession()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="default" size="icon" className="rounded-full">
					{session !== null ? (
						session.user.email!.split('@')[0].slice(0, 2).toUpperCase()
					) : (
						<Icons.userRound className="size-4" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				{session && (
					<React.Fragment>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p>Signed in as</p>
								<p className="mt-1.5 text-sm leading-none font-medium">{session.user.email!}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</React.Fragment>
				)}
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/profile">
							<Icons.userRound className="size-4 text-primary" aria-hidden="true" />
							Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard">
							<Icons.layoutDashboard className="size-4 text-primary" aria-hidden="true" />
							Dashboard
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild variant={session !== null ? 'destructive' : 'default'}>
						{session !== null ? (
							<LogoutButton className="w-full" />
						) : (
							<Link href="/login">
								<Icons.login className="size-4 text-primary" />
								Log in
							</Link>
						)}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
