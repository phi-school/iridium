import { defineConfig } from 'tsup'

export default defineConfig({
	clean: true,
	define: {
		'import.meta.vitest': 'false',
	},
	dts: true,
	format: ['cjs', 'esm'],
	minify: true,
	outDir: 'dist',
	splitting: false,
	target: 'node20',
	treeshake: true,
})
