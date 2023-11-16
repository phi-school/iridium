import { readFileSync, rmSync } from 'node:fs'
import { writeFile, mkdir } from 'node:fs/promises'
import { parse, resolve, isAbsolute } from 'node:path'

import { TemplateWriteError } from '@/error-handling'
import type { RenderedConfig } from '@/types'

/**
 * Saves rendered templates to the disk. It iterates over each template in the
 * configuration, ensures the output directory exists, and writes the rendered
 * content to the specified output path.
 *
 * @param {RenderedConfig} config - The configuration object containing rendered
 * templates.
 * @returns {Promise<void>} - A Promise that resolves when all templates have
 * been saved.
 */
export async function saveTemplatesToDisk(
	config: RenderedConfig,
): Promise<void> {
	const { templates, configDirectory } = config

	for (const template of templates) {
		const { outputPath, render, sourcePath } = template

		// Derive output file name from the template file name, replacing the '.art'
		// extension with ''.
		const outputFileName = `${parse(sourcePath).name}`

		// Resolve outputPath against the current working directory
		const outputDirectory = isAbsolute(outputPath)
			? outputPath
			: resolve(configDirectory, outputPath)

		const outputFilePath = resolve(outputDirectory, outputFileName)

		try {
			await mkdir(outputDirectory, { recursive: true })
			await writeFile(outputFilePath, render, 'utf8')
			console.log(`Template written to: ${outputFilePath}`)
		} catch (error) {
			if (error instanceof Error) {
				throw new TemplateWriteError(outputFilePath)
			}
			throw error
		}
	}
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	const mockSourcePath = 'mock-file.txt.art'
	const mockOutputPath = 'test-output'
	const mockRender = 'Hello, this is a test!'
	const mockOutputFilePath = `${mockOutputPath}/mock-file.txt`

	test('saveTemplatesToDisk saves templates to disk', async () => {
		// Mock configuration with one rendered template.
		const mockConfig: RenderedConfig = {
			configDirectory: '',
			templates: [
				{
					sourcePath: mockSourcePath,
					outputPath: mockOutputPath,
					render: mockRender,
					variables: [],
				},
			],
		}

		await saveTemplatesToDisk(mockConfig)

		// Check if the file was saved correctly.
		const savedContent = readFileSync(mockOutputFilePath, 'utf8')
		expect(savedContent).toBe(mockRender)

		// Cleanup.
		rmSync(mockOutputPath, {
			recursive: true,
			force: true,
		})
	})
}
