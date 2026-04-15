import { Readable } from 'stream'
import { NextRequest, NextResponse } from 'next/server'

import archiver from 'archiver'

import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/utils'

export async function POST(request: NextRequest): Promise<NextResponse> {
	console.log('started an export')

	try {
		const body = await request.json()
		const alkesFiles: { id: string; file_url: string }[] = body.alkesFiles || []

		if (alkesFiles.length === 0) {
			return NextResponse.json({ message: 'Dokumen kosong' }, { status: 400 })
		}

		const missingFiles = alkesFiles.filter((f) => !f.file_url).map((f) => f.id)

		if (missingFiles.length > 0) {
			return NextResponse.json(
				{
					message: `Berkas berikut rusak atau hilang: ${missingFiles.join(', ')}`,
				},
				{ status: 400 },
			)
		}

		const supabase = await createClient()
		const archive = archiver('zip', { zlib: { level: 5 } })

		const webStream = new ReadableStream({
			async start(controller) {
				let aborted = false

				// if the user closes the tab, this triggers
				request.signal.addEventListener('abort', () => {
					aborted = true
					archive.abort()
				})

				archive.on('data', (chunk) => controller.enqueue(chunk)) // bridge: Node.js "data" event -> web "enqueue"
				archive.on('end', () => controller.close()) // bridge: Node.js "end" event -> web "close"
				archive.on('error', (err) => controller.error(err)) // bridge: Node.js "error" event -> web "error"

				for (const file of alkesFiles) {
					if (aborted) {
						break
					}

					if (!file.file_url) {
						console.warn(`URL missing for ${file.id}`)
						continue
					}

					try {
						const response = await supabase.storage.from('cerindo/alkes').download(file.file_url) // will download the files into memory

						if (response.error !== null || !response.data) {
							throw new Error(response.error?.message || 'Berkas tidak ditemukan')
						}

						const extension = response.data.type.split('/')[1] || 'pdf'
						const entryPromise = new Promise((resolve) => archive.once('entry', resolve))
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const nodeReadable = Readable.fromWeb(response.data.stream() as any)

						archive.append(nodeReadable, { name: `${file.id}.${extension}` })
						await entryPromise
					} catch (error: unknown) {
						controller.error(
							new Error(`Gagal memproses ${file.id}: ${getErrorMessage(error) || 'Berkas berikut rusak atau hilang'}`),
						)

						archive.abort()
						return
					}
				}
				await archive.finalize()
			},
			cancel() {
				archive.abort()
			},
		})

		const exportDate = new Date().toISOString().split('T')[0]
		return new NextResponse(webStream, {
			status: 200,
			headers: new Headers({
				'content-type': 'application/zip',
				'content-disposition': `attachment; filename="alkes-export-${exportDate}.zip"`,
				'Transfer-Encoding': 'chunked',
			}),
		})
	} catch (error: unknown) {
		return NextResponse.json({ message: getErrorMessage(error) || 'Internal Server Error' }, { status: 500 })
	}
}
