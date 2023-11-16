import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import * as artTemplate from 'art-template'

import { TemplateReadError } from '@/error-handling'
import type {
	ConfigWithData,
	RenderedConfig,
	FilledVariable,
	RenderedTemplate,
	Primitive,
} from '@/types'

// TODO Improve comment

/**
 * Renders all templates in the provided configuration using their associated
 * variables.
 * @param config - A `ConfigWithData` object containing all the necessary data
 * for template rendering, including filled template variables and
 * multi-template variables.
 * @returns A promise resolving to a `RenderedConfig` object, where each
 * template is replaced with its rendered version, and all associated metadata
 * is preserved.
 * @throws TemplateReadError - If a template file cannot be read from disk,
 * encapsulating the original error and the path of the file that caused the
 * issue.
 */
export async function populateTemplates(
	config: ConfigWithData,
): Promise<RenderedConfig> {
	const { multiTemplateVariables, templates, configDirectory } = config

	const renderedTemplates: RenderedTemplate[] = []

	for (const template of templates) {
		const { variables = [], useMultiTemplateVariables, sourcePath } = template

		let templateContent: string

		try {
			const resolvedSourcePath = resolve(configDirectory, sourcePath)

			templateContent = readFileSync(resolvedSourcePath, 'utf8')
		} catch (error) {
			if (error instanceof Error) {
				throw new TemplateReadError(sourcePath)
			}
			throw error
		}

		const variablesMap = new Map(
			variables.map((variable: FilledVariable) => [variable.name, variable]),
		)

		// If useMultiTemplateVariables is defined, iterate over the array.
		if (useMultiTemplateVariables) {
			for (const variableName of useMultiTemplateVariables) {
				// Attempt to find a global variable with the current name.
				const globalVariable = multiTemplateVariables?.find(
					(variable: FilledVariable) => variable.name === variableName,
				)

				// If a global variable is found and it's not already defined locally,
				// add it to the variablesMap.
				if (globalVariable && !variablesMap.has(variableName)) {
					const { filledValue } = globalVariable

					const filledGlobalVariable = {
						...globalVariable,
						filledValue,
					} as unknown as FilledVariable

					variablesMap.set(variableName, filledGlobalVariable)
				}
			}
		}

		// Initialize an object to store the merged variables for rendering.
		const mergedVariables = {} as Record<string, Primitive | Primitive[]>

		// Iterate over the variablesMap and add each variable to the
		// mergedVariables object.
		variablesMap.forEach((variable) => {
			mergedVariables[variable.name] = variable.filledValue
		})

		const render = artTemplate.render(templateContent, mergedVariables)

		renderedTemplates.push({
			...template,
			render,
		})
	}

	return {
		...config,
		templates: renderedTemplates,
	}
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	const testSourcePath = 'test/fixtures/templates/mock-template.art'
	const mockOutputPath = 'mock/output/path'

	test('populateTemplates renders templates correctly', async () => {
		const mockConfig: ConfigWithData = {
			configDirectory: '',
			templates: [
				{
					sourcePath: testSourcePath,
					outputPath: mockOutputPath,
					variables: [
						{
							name: 'name',
							type: 'text',
							filledValue: 'World',
							clackOptions: {
								message: 'Enter name',
							},
						},
					],
				},
			],
		}

		const result = await populateTemplates(mockConfig)

		const expectedResult: RenderedConfig = {
			...mockConfig,
			templates: [
				{
					...mockConfig.templates[0],
					render: 'Hello, World!',
				},
			],
		}

		expect(result).toEqual(expectedResult)
	})

	test('populateTemplates handles missing template files', async () => {
		const mockConfig: ConfigWithData = {
			configDirectory: '',
			templates: [
				{
					sourcePath: 'test/fixtures/non-existing-template.art',
					outputPath: mockOutputPath,
					variables: [],
				},
			],
		}

		await expect(populateTemplates(mockConfig)).rejects.toThrow(
			'Failed to read template',
		)
	})

	test('populateTemplates merges multiTemplateVariables correctly', async () => {
		// Define a mock configuration with multiTemplateVariables.
		const mockConfig = {
			configDirectory: '',
			multiTemplateVariables: [
				{
					name: 'globalName',
					type: 'text',
					clackOptions: {
						message: 'Enter global name',
					},
					filledValue: 'Global',
				},
			],
			templates: [
				{
					sourcePath: 'test/fixtures/templates/mock-template.art',
					outputPath: mockOutputPath,
					variables: [
						{
							name: 'name',
							type: 'text',
							clackOptions: {
								message: 'Enter name',
							},
							filledValue: 'Local',
						},
					],
					useMultiTemplateVariables: ['globalName'],
				},
			],
		} as ConfigWithData

		// Call the function with the mock configuration.
		const result = await populateTemplates(mockConfig)

		// Define the expected result.
		const expectedResult: RenderedConfig = {
			...mockConfig,
			templates: [
				{
					...mockConfig.templates[0],
					render: 'Hello, Local!',
				},
			],
		}

		// Assert that the result matches the expected result. The local variable
		// should take precedence over the global variable.
		expect(result).toEqual(expectedResult)
	})
}
