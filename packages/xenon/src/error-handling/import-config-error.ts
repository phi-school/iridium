export class ImportConfigError extends Error {
	constructor(templatePath: string) {
		super(`Failed to import config from ${templatePath}`)
		this.name = 'ImportConfigError'
	}
}
