import type {
	TextOptions,
	ConfirmOptions,
	SelectOptions,
	MultiSelectOptions,
} from '@clack/prompts'

// ───────────────────────── Clack Select Option Types ─────────────────────────

export type Primitive = Readonly<string | boolean | number>

export type Options = { value: Primitive; label?: string; hint?: string }[]

// ────────────────────────────── Variable Types ───────────────────────────────

export type BaseVariable = {
	name: string
}

export type TextVariable = BaseVariable & {
	type: 'text'
	clackOptions: TextOptions
}

export type ConfirmVariable = BaseVariable & {
	type: 'confirm'
	clackOptions: ConfirmOptions
}

export type SelectVariable = BaseVariable & {
	type: 'select'
	clackOptions: SelectOptions<Options, Primitive>
}

export type MultiSelectVariable = BaseVariable & {
	type: 'multiselect'
	clackOptions: MultiSelectOptions<Options, Primitive>
}

// ────────────────────────────── Variable States ──────────────────────────────

export type UnfilledVariable =
	| TextVariable
	| ConfirmVariable
	| SelectVariable
	| MultiSelectVariable

export type FilledValueByType<T> = T extends 'text'
	? string
	: T extends 'confirm'
	  ? boolean
	  : T extends 'select'
	    ? Primitive
	    : T extends 'multiselect'
	      ? Primitive[]
	      : never

export type FilledVariable = {
	[K in UnfilledVariable as K['type']]: K & {
		filledValue: FilledValueByType<K['type']>
	}
}[UnfilledVariable['type']]
