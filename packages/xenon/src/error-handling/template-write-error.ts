export class TemplateWriteError extends Error {
	constructor(outputFilePath: string) {
		super(`Failed to write template to ${outputFilePath}`)
		this.name = 'TemplateWriteError'
	}
}
