import { defineConfig, mergeConfig } from 'vitest/config'

import baseConfig from '../../vitest.config'

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: {
			includeSource: ['src/**/*.{js,ts}'],
		},
		resolve: {
			alias: {},
		},
	}),
)
