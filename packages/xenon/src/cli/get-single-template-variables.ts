import { confirm, multiselect, select, text } from '@clack/prompts'

import type {
	UnpopulatedTemplate,
	PopulatedTemplate,
	FilledVariable,
	Primitive,
} from '@/types'

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
				const { clackOptions, type } = variable

				let filledValue: Primitive | Primitive[]

				switch (type) {
					case 'text': {
						filledValue = (await text(clackOptions)) as string
						break
					}
					case 'confirm': {
						filledValue = (await confirm(clackOptions)) as boolean
						break
					}
					case 'select': {
						filledValue = (await select(clackOptions)) as Primitive
						break
					}
					case 'multiselect': {
						filledValue = (await multiselect(clackOptions)) as Primitive[]
						break
					}
				}

				const filledVariable = { ...variable, filledValue } as FilledVariable

				filledVariables.push(filledVariable)

				// This 'fixes' an issue with Bun which causes
				// successive clack function calls to fail.
				//
				// https://github.com/natemoo-re/clack/issues/170
				// https://github.com/oven-sh/bun/issues/6052
				await (() => void 0)()
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
