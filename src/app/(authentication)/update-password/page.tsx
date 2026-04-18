import React from 'react'

import UpdatePasswordForm from '../_components/forms/update-password-form'

export default async function UpdatePasswordPage() {
	return (
		<section className="container mx-auto flex h-full max-w-lg flex-col items-start justify-center rounded-lg px-0">
			<div className="w-full">
				<UpdatePasswordForm />
			</div>
		</section>
	)
}
