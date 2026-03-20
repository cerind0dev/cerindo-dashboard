import type { NextConfig } from 'next'

import './src/env.ts'

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'picsum.photos',
				port: '',
				pathname: '/**/**',
				search: '',
			},
		],
		qualities: [100, 75],
	},
}

export default nextConfig

