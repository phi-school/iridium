import type { FilledVariable, UnfilledVariable } from './variables'

// ──────────────────────────── Template Base Type ─────────────────────────────

/**
 * The foundational type for template objects, providing the core properties
 * that define where a template is sourced from and where its populated version
 * should be written to.
 */
export type TemplateBase = {
	/** The file path to the source template. */
	sourcePath: string
	/** The file path where the populated template should be written to. */
	outputPath: string
	/**
	 * An optional array of multi-template variable names. When provided, these
	 * variables are applied to all templates listed in the configuration.
	 */
	useMultiTemplateVariables?: string[]

	/**
	 *
	 */
	metaVariables?: string[]
}

// ────────────────────────────── Template States ──────────────────────────────

/**
 * Extends `TemplateBase` to represent a template that is yet to be populated
 * with values. It may optionally include an array of `UnfilledVariable`
 * objects, representing the variables that need to be filled for this template.
 */
export type UnpopulatedTemplate = TemplateBase & {
	/** An optional array of variables that need to be filled to populate this
	 * template. */
	variables?: UnfilledVariable[]
}

/**
 * Extends `TemplateBase` and represents a template that has been populated with
 * user-provided values. It includes an array of `FilledVariable` objects,
 * representing the variables that have been filled.
 */
export type PopulatedTemplate = TemplateBase & {
	/** An array of filled variables for this template. */
	variables: FilledVariable[]
}

/**
 * Extends `PopulatedTemplate` to represent a template that has been fully
 * rendered as a string. This is the final state of a template before it is
 * written to disk.
 */
export type RenderedTemplate = PopulatedTemplate & {
	/** The fully rendered template as a string. */
	render: string
}
