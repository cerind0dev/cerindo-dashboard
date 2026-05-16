'use client'

import React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

import { cn } from '@/lib/utils/utils'

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

import type { SidebarNavigationItem } from '@/types/index.types'

interface SidebarItemProps {
	item: SidebarNavigationItem
	level?: number
	defaultOpen?: boolean
}

function SidebarItem({ item, level = 0, defaultOpen = false }: SidebarItemProps) {
	const Icon = item.icon ? Icons[item.icon as keyof typeof Icons] : Icons.chevronRight

	const hasChildren = item.items.length > 0

	const indentStyle = {
		paddingLeft: `${level * 16 + 8}px`,
	}

	if (!hasChildren) {
		return (
			<SidebarMenuItem className="px-2">
				<SidebarMenuButton asChild isActive={item.active}>
					<Link href={item.href ?? '#'} className="flex items-center gap-2" style={indentStyle}>
						{item.icon && <Icon className="size-4 shrink-0" />}
						<span>{item.title}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		)
	}

	return (
		<Collapsible defaultOpen={defaultOpen || item.active} className="group/collapsible px-2">
			<SidebarGroup className="gap-1 p-0">
				<SidebarGroupLabel
					asChild
					className="group/label p-0 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
				>
					<CollapsibleTrigger className="flex w-full items-center gap-2 py-2" style={indentStyle}>
						<Icons.chevronRight className="size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
						{item.icon && <Icon className="size-4 shrink-0" />}
						<span>{item.title}</span>
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{item.items.map((child) => (
								<SidebarItem key={child.title} item={child} level={level + 1} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	)
}

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
					title: 'Alkes Luar Negeri',
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
					title: 'Pencarian Alkes',
					href: '/dashboard/search-alkes',
					active: segments.includes('search-alkes'),
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
			<SidebarContent>
				<SidebarMenu>
					{sidebarNavigation.map((item, index) => (
						<SidebarItem key={item.title} item={item} defaultOpen={index === 1} />
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}
