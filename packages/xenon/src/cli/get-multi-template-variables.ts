import { confirm, multiselect, select, text } from '@clack/prompts'

import type { FilledVariable, Primitive, UnfilledVariable } from '@/types'

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

		filledMultiTemplateVariables.push(filledVariable)
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
