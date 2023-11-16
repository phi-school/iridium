export class ConfigNotFoundError extends Error {
	constructor(path: string) {
		super(`Configuration not found at ${path}`)
		this.name = 'ConfigNotFoundError'
	}
}
