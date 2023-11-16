import { log } from '@/utils'

export function handleError(error: Error) {
	log.error('Error generating templates', error)
	process.exit(1)
}
