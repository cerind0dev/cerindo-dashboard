import { Readable } from 'stream'
import { NextRequest, NextResponse } from 'next/server'

import archiver from 'archiver'

import { serveAlkesFileSchema } from '@/lib/features/alkes/alkes-validation'
import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils/utils'

export async function POST(request: NextRequest): Promise<NextResponse> {
	let body: unknown

	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ message: 'Invalid or empty JSON payload' }, { status: 400 })
	}

	const result = serveAlkesFileSchema.safeParse(body)

	if (!result.success) {
		return NextResponse.json({ message: getErrorMessage(result.error) }, { status: 400 })
	}

	const { alkesFiles } = result.data

	try {
		const controller = new AbortController()
		const supabase = await createClient()
		const archive = archiver('zip', { zlib: { level: 1 } })

		let aborted = false

		function onRequestAbort() {
			aborted = true
			controller.abort()
			archive.destroy()
		}

		/**
		 * appends a file to archive and waits for its zip entry to finish. call sequentially:
		 * the archive's next `entry` event must belong to this file.
		 * rejects on archive or source errors, or premature archive closure.
		 * archive listeners are removed when the wait settles
		 * each outcome should remove all three archive listeners before settling the promise
		 * otherwise, unused archive listeners accumulate as we process files?
		 *
		 * the source error listener remains until source closure to handle errors during cancellation.
		 */
		function appendFileToArchive(source: Readable, filename: string): Promise<void> {
			return new Promise<void>((resolve, reject) => {
				function cleanupArchive() {
					archive.off('entry', onEntry)
					archive.off('error', onError)
					archive.off('close', onClose)
				}

				function cleanupSource() {
					source.off('error', onError)
				}

				function onEntry() {
					cleanupArchive()
					resolve()
				}

				function onError(error: Error) {
					cleanupArchive()
					reject(error)
				}

				function onClose() {
					cleanupArchive()
					reject(new Error('Archive closed before the file entry completed'))
				}

				archive.once('entry', onEntry)
				archive.once('error', onError)
				archive.once('close', onClose)

				source.on('error', onError)
				source.once('close', cleanupSource)

				try {
					archive.append(source, { name: filename })
				} catch (error: unknown) {
					cleanupArchive()
					reject(error)
				}
			})
		}

		async function produceArchive() {
			for (const file of alkesFiles) {
				if (aborted) {
					return
				}

				try {
					const response = await supabase.storage.from('cerindo/alkes').createSignedUrl(file.file_url, 60)

					if (response.error !== null || !response.data) {
						throw new Error(response.error?.message || 'Berkas tidak ditemukan')
					}

					const fileResponse = await fetch(response.data.signedUrl, { signal: controller.signal })
					if (!fileResponse.ok || !fileResponse.body) {
						throw new Error('Gagal mengunduh berkas')
					}

					const contentType = fileResponse.headers.get('content-type') || 'application/pdf'
					const mimeType = contentType.split(';')[0].trim().toLowerCase()
					const extension = mimeType.split('/')[1] || 'pdf'

					const nodeReadable = Readable.fromWeb(fileResponse.body as Parameters<typeof Readable.fromWeb>[0]) // ai help

					if (aborted || archive.destroyed) {
						nodeReadable.destroy()
						return
					}

					await appendFileToArchive(nodeReadable, `${file.id}.${extension}`)
				} catch (error: unknown) {
					throw new Error(`Gagal memproses ${file.id}: ${getErrorMessage(error) || 'Berkas berikut rusak atau hilang'}`)
				}
			}

			await archive.finalize()
		}

		const webStream = Readable.toWeb(archive, {
			strategy: {
				highWaterMark: 64 * 1024,
				size: (chunk) => chunk.byteLength,
			},
		})

		request.signal.addEventListener('abort', onRequestAbort, { once: true })

		archive.once('close', () => {
			aborted = true
			controller.abort()
			request.signal.removeEventListener('abort', onRequestAbort)
		})

		if (request.signal.aborted) {
			onRequestAbort()
		}

		void produceArchive().catch((error: unknown) => {
			controller.abort()
			archive.destroy(error instanceof Error ? error : new Error(getErrorMessage(error)))
		})

		const exportDate = new Date().toISOString().split('T')[0]

		return new NextResponse(webStream as ReadableStream<Uint8Array>, {
			status: 200,
			headers: new Headers({
				'content-type': 'application/zip',
				'content-disposition': `attachment; filename="alkes-export-${exportDate}.zip"`,
			}),
		})
	} catch (error: unknown) {
		return NextResponse.json({ message: getErrorMessage(error) || 'Internal Server Error' }, { status: 500 })
	}
}
