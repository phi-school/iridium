export function greet(name: string): string {
	return `Hello, ${name}!`
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('greet', () => {
		expect(greet('World')).toBe('Hello, World!')
	})
}
export const hello = 'world'
