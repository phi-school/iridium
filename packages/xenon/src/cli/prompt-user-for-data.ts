import { getMultiTemplateVariables } from './get-multi-template-variables'
import { getSingleTemplateVariables } from './get-single-template-variables'

import {
	ConfigWithData,
	FilledVariable,
	ResolvedConfig,
	PopulatedTemplate,
} from '@/types'

/**
 * Guides the user through CLI prompts to collect data required for populating
 * templates and variables.
 * @param resolvedConfig - The configuration object that has been resolved with
 * paths and possibly multi-template variables.
 * @returns A promise resolving to a `ConfigWithData` object, containing the
 * populated templates and variables, ready for further processing.
 */
export async function promptUserForData(
	resolvedConfig: ResolvedConfig,
): Promise<ConfigWithData> {
	const { multiTemplateVariables, templates } = resolvedConfig

	let filledMultiTemplateVariables: FilledVariable[] = []

	if (multiTemplateVariables) {
		filledMultiTemplateVariables = await getMultiTemplateVariables(
			multiTemplateVariables,
		)
	}

	const populatedTemplates: PopulatedTemplate[] =
		await getSingleTemplateVariables(templates)

	const configWithData: ConfigWithData = {
		...resolvedConfig,
		multiTemplateVariables: filledMultiTemplateVariables,
		templates: populatedTemplates,
	}

	return configWithData
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	// TODO Test: mock CLI

	test('promptUserForData is tested', () => {
		expect.fail()
	})
}
