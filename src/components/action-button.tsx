'use client'

import React, { useId, useState } from 'react'

import { toast } from 'sonner'

import { cn, getErrorMessage } from '@/lib/utils/utils'

import Icons from './icons'
import { Button } from './ui/button'

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
	action: () => Promise<void>
	children?: React.ReactNode
	message: {
		loading: string
		success: string
		error?: string
	}
}

export default function ActionButton({
	className,
	action,
	children,
	message,
	onClick,
	disabled,
	...props
}: ActionButtonProps) {
	const toastId = useId()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleAction = async (event: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(event)

		setIsLoading(true)
		const currentToastId = `toast-${toastId}`

		try {
			toast.loading(message.loading, { id: currentToastId, position: 'top-right' })
			await action()
			toast.success(message.success, { id: currentToastId, position: 'top-right' })
		} catch (error: unknown) {
			toast.error(getErrorMessage(error) || message.error, { id: currentToastId, position: 'top-right' })
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button disabled={isLoading || disabled} onClick={handleAction} className={cn(className)} {...props}>
			{isLoading && <Icons.loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
			{children}
		</Button>
	)
}
