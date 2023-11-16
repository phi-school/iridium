/**
 * Retrieves the value of a specified command line argument.
 * @param key - The argument key to search for in the command line arguments.
 * @returns The value associated with the argument key if found, otherwise
 * `null`.
 */
export function getArgument(key: string): string | null {
	const index = process.argv.indexOf(key)
	return index === -1 ? null : process.argv[index + 1]
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	// A helper function to temporarily set process.argv for a test.
	const withProcessArgv = (args: string[], function_: () => void) => {
		const originalArgv = process.argv
		process.argv = [...originalArgv.slice(0, 2), ...args]
		try {
			function_()
		} finally {
			process.argv = originalArgv
		}
	}

	test('getArgument retrieves the correct argument value', () => {
		withProcessArgv(['--name', 'God', '--age', '∞'], () => {
			expect(getArgument('--name')).toBe('God')
			expect(getArgument('--age')).toBe('∞')
		})
	})

	test('getArgument returns null for missing arguments', () => {
		withProcessArgv(['--name', 'God'], () => {
			expect(getArgument('--age')).toBeNull()
		})
	})

	test('getArgument handles arguments without values correctly', () => {
		withProcessArgv(['--name', 'God', '--flag', '--age', '∞'], () => {
			expect(getArgument('--flag')).toBe('--age')
			expect(getArgument('--name')).toBe('God')
			expect(getArgument('--age')).toBe('∞')
		})
	})
}
