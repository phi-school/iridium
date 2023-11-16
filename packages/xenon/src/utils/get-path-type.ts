import {
	access,
	constants,
	stat,
	mkdir,
	rmdir,
	writeFile,
	unlink,
} from 'node:fs/promises'
import { join } from 'node:path'

import { PathNotFoundError } from '@/error-handling'
import { get__dirname } from '@/utils'

/**
 * Checks whether the given path is a directory or a file.
 *
 * @param {string} path - The path to check.
 *
 * @returns {Promise<'directory' | 'file'>} A promise that resolves to either
 * 'directory' or 'file', indicating the type of the path.

 * @throws {PathNotFoundError} If the path does not exist and no custom error is
 * provided.
 */
export async function getPathType(path: string): Promise<'directory' | 'file'> {
	try {
		await access(path, constants.F_OK)
	} catch (error) {
		if (error instanceof Error) {
			throw new PathNotFoundError(path)
		}
	}

	const pathType = await stat(path)
	return pathType.isDirectory() ? 'directory' : 'file'
}

// ─────────────────────────────────── TEST ────────────────────────────────────

if (import.meta.vitest) {
	const { test, expect, beforeAll, afterAll } = import.meta.vitest

	const __dirname = get__dirname(import.meta)

	const testDirectory = join(__dirname, 'testDir')
	const testFile = join(testDirectory, 'testFile.txt')

	beforeAll(async () => {
		await mkdir(testDirectory)
		await writeFile(testFile, 'Hello, world!')
	})

	afterAll(async () => {
		await unlink(testFile)
		await rmdir(testDirectory)
	})

	test('should return "directory" for a directory path', async () => {
		const type = await getPathType(testDirectory)
		expect(type).toBe('directory')
	})

	test('should return "file" for a file path', async () => {
		const type = await getPathType(testFile)
		expect(type).toBe('file')
	})

	test('should throw PathNotFoundError for a non-existent path', async () => {
		await expect(
			getPathType(join(testDirectory, 'nonExistent')),
		).rejects.toThrow()
	})
}
