import type { RawConfig } from '@/types'

/**
 * Validates the configuration object, providing type checking and IntelliSense.
 *
 * @param config The configuration object to validate.
 * @returns The validated configuration object.
 */
export function defineConfig(config: RawConfig): RawConfig {
	// Additional runtime validation can go here, if necessary.
	return config
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('defineConfig is tested', () => {
		expect.fail()
	})
}
