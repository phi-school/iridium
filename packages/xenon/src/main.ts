import { getArgument } from '@/cli'
import { generateFromTemplates } from '@/core'
import { handleError } from '@/error-handling'

/**
 * Entry point of the application. Catches all application errors.
 */
const main = async () => {
	const configDirectory = getArgument('--config')

	try {
		await (configDirectory
			? generateFromTemplates(configDirectory)
			: generateFromTemplates())
	} catch (error) {
		if (error instanceof Error) handleError(error)
		throw error
	}
}

main()
