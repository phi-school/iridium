export class TemplateReadError extends Error {
	constructor(templatePath: string) {
		super(`Failed to read template ${templatePath}`)
		this.name = 'TemplateReadError'
	}
}
