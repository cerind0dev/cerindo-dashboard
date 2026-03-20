import Icons from '@/components/icons'

export type NavigationItem = {
	title: string
	href?: string
	active?: boolean
	disabled?: boolean
	icon?: keyof typeof Icons
}

export interface NavigationItemWithChildren extends NavigationItem {
	items: NavigationItemWithChildren[]
}

export type SidebarNavigationItem = NavigationItemWithChildren
