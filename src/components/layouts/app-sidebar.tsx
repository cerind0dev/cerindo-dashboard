'use client'

import React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

import Icons from '@/components/icons'
import Logo from '@/components/logo'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'

import type { SidebarNavigationItem } from '@/types'

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const segments = useSelectedLayoutSegments()

	const sidebarNavigation: SidebarNavigationItem[] = [
		{
			title: 'Dashboard',
			href: '/dashboard',
			active: segments.includes('dashboard') && segments.length === 1,
			icon: 'layoutDashboard',
			items: [],
		},
		{
			title: 'Master Data',
			icon: 'database',
			items: [
				{
					title: 'Shipper',
					href: '/dashboard/master-data/shipper',
					active: segments.includes('shipper'),
					items: [],
				},
				{
					title: 'Consignee',
					href: '/dashboard/master-data/consignee',
					active: segments.includes('consignee'),
					items: [],
				},
				{
					title: 'Alat Kesehatan Luar Negeri',
					href: '/dashboard/master-data/alat-kesehatan-luar-negeri',
					active: segments.includes('alat-kesehatan-luar-negeri'),
					items: [],
				},
			],
		},
		{
			title: 'Utilities',
			icon: 'wrench',
			items: [
				{
					title: 'Pencarian AKL',
					href: '/dashboard/search-akl',
					active: segments.includes('search-akl'),
					icon: 'heartPulse',
					items: [],
				},
			],
		},
	]

	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-16 justify-center">
				<Logo className="p-2" />
			</SidebarHeader>
			<SidebarContent className="">
				{sidebarNavigation.map((item, index) => {
					const Icon = item.icon ? Icons[item.icon as keyof typeof Icons] : Icons.chevronRight

					return item.items.length === 0 ? (
						<SidebarGroup key={item.title} className="py-0 group-data-[collapsible=icon]:hidden">
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild isActive={item.active}>
										<Link href={item.href!}>
											<Icon />
											{item.title}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroup>
					) : (
						<Collapsible key={item.title} title={item.title} defaultOpen={index === 2} className="group/collapsible">
							<SidebarGroup className="py-0">
								<SidebarGroupLabel
									asChild
									className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								>
									<CollapsibleTrigger>
										<Icon className="mr-2" />
										{item.title}
										<Icons.chevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
									</CollapsibleTrigger>
								</SidebarGroupLabel>
								<CollapsibleContent>
									<SidebarGroupContent>
										<SidebarMenu>
											{item.items.map((item) => {
												return (
													<SidebarMenuItem key={item.title}>
														<SidebarMenuButton asChild isActive={item.active}>
															<Link href={item.href!}>{item.title}</Link>
														</SidebarMenuButton>
													</SidebarMenuItem>
												)
											})}
										</SidebarMenu>
									</SidebarGroupContent>
								</CollapsibleContent>
							</SidebarGroup>
						</Collapsible>
					)
				})}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}
