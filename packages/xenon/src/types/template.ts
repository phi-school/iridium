// ──────────────────────────── Template Variables ─────────────────────────────

/**
 * Represents a template variable that has not been filled with a user-provided
 * value. It includes necessary details such as the variable's name, a prompt
 * for the user, and an optional default value.
 */
export type UnfilledVariable = {
	/** The name of the variable, used as a key to replace placeholders in
	 * templates. */
	name: string
	/** The user prompt text displayed in the CLI to guide the user to provide a
	 * value for this variable. */
	userPrompt: string
	/** An optional default value for the variable, used if the user does not
	 * provide a value. */
	defaultValue?: string
}

/**
 * Extends `UnfilledVariable` and represents a template variable that has been
 * filled with a user-provided value.
 */
export type FilledVariable = UnfilledVariable & {
	/** The user-provided value for the variable. */
	filledValue: string
}

// ──────────────────────────── Template Base Type ─────────────────────────────

/**
 * The foundational type for template objects, providing the core properties
 * that define where a template is sourced from and where its populated version
 * should be written to.
 */
type TemplateBase = {
	/** The file path to the source template. */
	sourcePath: string
	/** The file path where the populated template should be written to. */
	outputPath: string
	/**
	 * An optional array of multi-template variable names. When provided, these
	 * variables are applied to all templates listed in the configuration.
	 */
	useMultiTemplateVariables?: string[]
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

// ────────────────────────── Configuration Base Type ──────────────────────────

/**
 * The foundational type for configuration objects, providing the core
 * properties needed to define multi-template variables and the list of
 * templates.
 */
type ConfigBase = {
	/** An optional array of multi-template variables that are applied to all
	 * templates listed in the configuration. */
	multiTemplateVariables?: UnfilledVariable[]
	/** An array of `UnpopulatedTemplate` objects representing the templates
	 * defined in the configuration. */
	templates: UnpopulatedTemplate[]
}

// ─────────────────────────── Configuration States ────────────────────────────

/**
 * Represents the initial state of a user configuration, mirroring `ConfigBase`.
 */
export type RawConfig = ConfigBase

/**
 * Extends `ConfigBase` to represent a configuration object whose file paths
 * have been resolved relative to the configuration file's directory.
 */
export type ResolvedConfig = RawConfig & {
	/**
	 * The directory path of the configuration file, used to resolve relative
	 * file paths.
	 */
	configDirectory: string
}

/**
 * Extends `ResolvedConfig` to represent a configuration object that has been
 * populated with user-provided values for multi-template variables and whose
 * templates have been populated with variables.
 */
export type ConfigWithData = ResolvedConfig & {
	/** An optional array of filled multi-template variables. */
	multiTemplateVariables?: FilledVariable[]
	/** An array of `PopulatedTemplate` objects representing the templates with
	 * filled variables. */
	templates: PopulatedTemplate[]
}

/**
 * Extends `ConfigWithData` to represent the final state of a configuration
 * object, where all templates have been fully rendered and are ready to be
 * written to disk.
 */
export type RenderedConfig = ConfigWithData & {
	/** An array of `RenderedTemplate` objects representing the fully rendered
	 * templates. */
	templates: RenderedTemplate[]
}
