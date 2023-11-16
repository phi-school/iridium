import { existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { ConfigNotFoundError, ImportConfigError } from '@/error-handling'
import { ResolvedConfig, RawConfig } from '@/types'
import { getPathType } from '@/utils'

/**
 * Loads a user configuration file from a specified directory or file path.
 * Supports both JavaScript and TypeScript configuration files.
 *
 * @param {string} [directoryOrFilePath] The directory or file path where the
 * configuration file is located. If not provided, the current working directory
 * is used.
 *
 * @returns {Promise<ResolvedConfig>} A promise that resolves to the user's
 * configuration object.
 *
 * @throws {ConfigNotFoundError} If the specified path does not exist.
 * @throws {ImportConfigError} If the configuration file exists but cannot be
 * imported due to an error.
 */
export async function loadUserConfig(
	directoryOrFilePath?: string,
): Promise<ResolvedConfig> {
	const configPath = directoryOrFilePath
		? resolve(process.cwd(), directoryOrFilePath)
		: process.cwd()

	// Throws a PathNotFoundError if configPath doesn't exist.
	const pathType = await getPathType(configPath)

	const configDirectory =
		pathType === 'directory' ? configPath : dirname(configPath)

	let userConfig: { default: RawConfig } | null = null

	const configPathJS = join(configDirectory, 'xenon.config.js')
	const configPathTS = join(configDirectory, 'xenon.config.ts')

	try {
		if (existsSync(configPathJS)) {
			userConfig = await import(pathToFileURL(configPathJS).href)
		} else if (existsSync(configPathTS)) {
			userConfig = await import(pathToFileURL(configPathTS).href)
		} else {
			throw new ConfigNotFoundError(configDirectory)
		}
	} catch (error) {
		if (error instanceof ConfigNotFoundError) {
			throw error
		} else if (error instanceof Error) {
			throw new ImportConfigError(configDirectory)
		}
	}

	return {
		...userConfig!.default,
		configDirectory,
	}
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('loadUserConfig is tested', () => {
		expect.fail()
	})
}
