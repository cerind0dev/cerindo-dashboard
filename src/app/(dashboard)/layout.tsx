import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import AppSidebar from '@/components/layouts/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import UserAccountNavigation from '@/components/user-account-navigation'

type DashboardRootLayoutProps = {
	children: React.ReactNode
}

export default async function DashboardRootLayout({ children }: DashboardRootLayoutProps) {
	const supabase = await createClient()
	const response = await supabase.auth.getClaims()

	if (response.error || !response.data?.claims) {
		redirect('/login')
	}

	return (
		<SidebarProvider className="relative overflow-hidden">
			<AppSidebar />
			<SidebarInset className="min-h-full">
				<header className="sticky inset-x-0 top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
					</div>
					<div className="ml-auto px-3">
						<UserAccountNavigation />
					</div>
				</header>
				<div className="relative h-[calc(100vh-64px)] w-full bg-muted">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
