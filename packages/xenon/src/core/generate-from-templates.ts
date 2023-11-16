import { promptUserForData } from '@/cli'
import { loadUserConfig } from '@/config'
import {
	fetchTemplateData,
	handlePopulatedTemplates,
	populateTemplates,
	saveTemplatesToDisk,
} from '@/core'

/**
 * Main function to generate files from templates based on user input and
 * configuration.
 * @param configDirectory - Optional directory path for loading the user's
 * configuration file. If not provided, default search paths will be used.
 * @returns A promise that resolves when all templates have been processed and
 * the generated files have been saved to disk.
 */
export async function generateFromTemplates(configDirectory?: string) {
	const resolvedConfig = await loadUserConfig(configDirectory)

	const configWithData = await fetchTemplateData(
		resolvedConfig,
		promptUserForData,
	)

	const renderedConfig = await populateTemplates(configWithData)

	await handlePopulatedTemplates(renderedConfig, saveTemplatesToDisk)
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	// TODO Test: mock CLI

	test('generateFromTemplates is tested', () => {
		expect.fail()
	})
}
