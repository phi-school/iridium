// src/templates/handle-populated-templates.ts

import { RenderedConfig } from '@/types'

/**
 * Handles the rendered templates within a provided configuration. It accepts a
 * callback function which gets executed with the rendered configuration as its
 * argument. The result of the callback function is returned.
 *
 * @param {RenderedConfig} config - The configuration object containing rendered
 * templates.
 * @param {Function} callback - The callback function to be executed with the
 * rendered templates.
 * @returns {Promise<T>} - The result of the callback function.
 */
export async function handlePopulatedTemplates<T>(
	config: RenderedConfig,
	callback: (config: RenderedConfig) => Promise<T>,
): Promise<T> {
	// Execute the callback function with the rendered configuration and return
	// its result.
	const result = await callback(config)
	return result
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('handlePopulatedTemplates handles templates and executes callback', async () => {
		const mockConfig = {
			templates: [{ render: 'Rendered Content', outputPath: 'output/path' }],
		}

		const callback = async (config: RenderedConfig) => {
			return config.templates[0].render
		}

		const result = await handlePopulatedTemplates(
			mockConfig as RenderedConfig,
			callback,
		)
		expect(result).toBe('Rendered Content')
	})
}
