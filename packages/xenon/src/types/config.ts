import type {
	UnpopulatedTemplate,
	PopulatedTemplate,
	RenderedTemplate,
} from './template'
import type { FilledVariable, UnfilledVariable } from './variables'

// ────────────────────────── Configuration Base Type ──────────────────────────

/**
 * The foundational type for configuration objects, providing the core
 * properties needed to define multi-template variables and the list of
 * templates.
 */
export type ConfigBase = {
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
