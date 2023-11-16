export class PathNotFoundError extends Error {
	constructor(path: string) {
		super(`Path not found: ${path}`)
		this.name = 'PathNotFoundError'
	}
}
