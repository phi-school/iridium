import { dirname as pathDirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function get__dirname(importMeta: ImportMeta) {
	return pathDirname(get__filename(importMeta))
}

export function get__filename(importMeta: ImportMeta) {
	return importMeta.url ? fileURLToPath(importMeta.url) : ''
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('dirname', () => {
		expect(get__dirname(import.meta)).toBe(join(process.cwd(), 'src/utils'))
	})

	test('filename', () => {
		expect(get__filename(import.meta)).toBe(
			join(process.cwd(), 'src/utils/get-dirname.ts'),
		)
	})
}
