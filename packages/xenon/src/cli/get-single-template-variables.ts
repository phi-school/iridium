import enquirer from 'enquirer'

import { UnpopulatedTemplate, PopulatedTemplate, FilledVariable } from '@/types'

/**
 * Prompts the user to input values for variables in each template and returns
 * templates populated with user responses.
 * @param templates - An array of `UnpopulatedTemplate` objects, each possibly
 * containing variables to be filled.
 * @returns A promise that resolves to an array of `PopulatedTemplate` objects,
 * where each template's variables are filled with user-provided values or
 * remain empty if no variables are present.
 */
export async function getSingleTemplateVariables(
	templates: UnpopulatedTemplate[],
): Promise<PopulatedTemplate[]> {
	const populatedTemplates: PopulatedTemplate[] = []

	for (const template of templates) {
		const { variables } = template

		if (variables) {
			const filledVariables: FilledVariable[] = []

			for (const variable of variables) {
				const { defaultValue, name, userPrompt } = variable

				const answer = (await enquirer.prompt({
					type: 'input',
					name,
					message: userPrompt,
					initial: defaultValue,
				})) as Record<string, string>

				filledVariables.push({
					...variable,
					filledValue: answer[name],
				})
			}

			populatedTemplates.push({
				...template,
				variables: filledVariables,
			})
		} else {
			populatedTemplates.push({
				...template,
				variables: [],
			})
		}
	}

	return populatedTemplates
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	// TODO Test: mock CLI

	test('getSingleTemplateVariables is tested', () => {
		expect.fail()
	})
}
