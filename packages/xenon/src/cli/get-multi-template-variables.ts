import enquirer from 'enquirer'

import { FilledVariable, UnfilledVariable } from '@/types'

/**
 * Prompts the user for input to fill the multi-template variables using the
 * CLI.
 * @param multiTemplateVariables - An array of `UnfilledVariable` objects
 * representing the multi-template variables to be filled.
 * @returns A promise that resolves to an array of `FilledVariable` objects,
 * each containing the user-provided values.
 */
export async function getMultiTemplateVariables(
	multiTemplateVariables: UnfilledVariable[],
): Promise<FilledVariable[]> {
	const filledMultiTemplateVariables: FilledVariable[] = []

	for (const variable of multiTemplateVariables) {
		const { defaultValue, name, userPrompt } = variable

		const answer = (await enquirer.prompt({
			type: 'input',
			name,
			message: userPrompt,
			initial: defaultValue,
		})) as Record<string, string>

		filledMultiTemplateVariables.push({
			...variable,
			filledValue: answer[name],
		})
	}

	return filledMultiTemplateVariables
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	// TODO Test: mock CLI

	test('getMultiTemplateVariables is tested', () => {
		expect.fail()
	})
}
