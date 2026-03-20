'use client'

import React, { useTransition } from 'react'

import { logInWithOAuth } from '@/lib/actions/auth'

import Icons from '@/components/icons'
import { Button } from '@/components/ui/button'

import type { Provider } from '@supabase/supabase-js'

const oauthProviders = [{ name: 'Google', provider: 'google', icon: 'google' }] satisfies {
	name: string
	provider: Provider
	icon: keyof typeof Icons
}[]

export default function OAuthLogin() {
	const [isPending, startTransition] = useTransition()

	return (
		<div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
			{oauthProviders.map((provider) => {
				const Icon = Icons[provider.icon]

				return (
					<Button
						key={provider.provider}
						variant="outline"
						className="w-full bg-background"
						onClick={() => {
							startTransition(async () => {
								await logInWithOAuth(provider.provider)
							})
						}}
						disabled={isPending}
					>
						{isPending ? (
							<Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
						) : (
							<Icon className="size-4" aria-hidden="true" />
						)}
						{provider.name}
						<span className="sr-only">{provider.provider}</span>
					</Button>
				)
			})}
		</div>
	)
}
