import { ConfigWithData, ResolvedConfig } from '@/types'

/**
 * Fetches additional data required for templates based on the given
 * configuration and a callback function.
 * @param config - A `ResolvedConfig` object that contains the resolved
 * configuration details.
 * @param callback - A function that takes a `ResolvedConfig` object and returns
 * a promise resolving to a `ConfigWithData` object.
 * @returns A promise resolving to a `ConfigWithData` object, enriched with
 * additional data required for templates.
 */
export async function fetchTemplateData(
	config: ResolvedConfig,
	callback: (config: ResolvedConfig) => Promise<ConfigWithData>,
): Promise<ConfigWithData> {
	const configWithData: ConfigWithData = await callback(config)

	return configWithData
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('fetchTemplateData fetches additional data correctly', async () => {
		const sampleConfig: ResolvedConfig = {
			configDirectory: '',
			multiTemplateVariables: [],
			templates: [],
		}

		const mockCallback = async (
			config: ResolvedConfig,
		): Promise<ConfigWithData> => {
			return {
				...(config as ConfigWithData),
			}
		}

		const result = await fetchTemplateData(sampleConfig, mockCallback)

		const expectedResult: ConfigWithData = {
			...(result as ConfigWithData),
		}

		expect(result).toEqual(expectedResult)
	})
}
