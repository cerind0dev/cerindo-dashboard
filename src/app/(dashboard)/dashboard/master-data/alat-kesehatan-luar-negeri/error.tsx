'use client'

import { Button } from '@/components/ui/button'

export default function AlkesError({ retry }: { retry: () => void }) {
	return (
		<div className="flex min-h-96 flex-col items-center justify-center gap-4 p-8" role="alert">
			<p>Data alkes gagal dimuat. Silakan coba lagi.</p>
			<Button onClick={() => retry()}>Coba lagi</Button>
		</div>
	)
}
