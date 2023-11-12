import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	define: {
		'import.meta.vitest': 'undefined',
	},
	plugins: [tsconfigPaths()],
})
