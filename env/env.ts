import { object, safeParse, picklist } from 'valibot'

// Add secret variables to delete from `process.env` after processing for
// improved security.
const secrets: Array<keyof typeof envSchema.entries> = []

const envSchema = object({
	NODE_ENV: picklist(['development', 'production', 'test']),

	// Add valibot typed environment variables here
})

const parsedEnvSchema = safeParse(envSchema, process.env)

// Format and log any errors to the console.
if (!parsedEnvSchema.success) {
	const { issues } = parsedEnvSchema

	console.error('ERROR: Missing or invalid environment variable:')

	issues.forEach((issue) => {
		const message = issue.message
		const key = issue.path?.[0].key

		console.log(`  ${key}: ${message}`)
	})

	process.exit(1)
}

// Make the env object immutable.
export const env = Object.freeze(parsedEnvSchema.output)

// Delete secrets from `process.env` for improved security.
for (const secret of secrets) {
	delete process.env[secret]
}
