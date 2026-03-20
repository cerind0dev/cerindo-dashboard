import React from 'react'

import { rubik } from '@/config/font'

import { PageHeader, PageHeaderHeading } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default async function IndexPage() {
	return (
		<React.Fragment>
			<section
				id="shipment-tracking"
				className="mx-auto flex max-w-6xl flex-col items-center gap-y-2 px-4 py-8 sm:px-6 lg:px-8"
			>
				<PageHeader as={'div'}>
					<PageHeaderHeading className={`${rubik.className}`}>Track your shipment</PageHeaderHeading>
				</PageHeader>
				<Field className="mt-2 sm:mt-4 lg:mt-8">
					<FieldLabel htmlFor="input-group-shipment-tracking" className="sr-only">
						Track your shipment
					</FieldLabel>
					<Input
						id="input-group-shipment-tracking"
						placeholder="Please enter AJU number"
						className="h-12 placeholder:text-sm"
					></Input>
					<Button variant="default" size="lg">
						Track
					</Button>
				</Field>
			</section>
		</React.Fragment>
	)
}
