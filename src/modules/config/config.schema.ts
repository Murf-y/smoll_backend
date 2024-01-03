import * as Joi from 'joi'

const configSchema = Joi.object({
  MONGODB_PORT: Joi.number().default(27017),
  MONGODB_URL: Joi.string().default('mongodb://localhost:27017/skeletondb'),
  MONGODB_URL_E2E_TEST: Joi.string().default('mongodb://localhost:27017/testdb'),
  MONGODB_NAME: Joi.string().default('skeletondb'),
  MONGODB_HOST: Joi.string(),
  MONGODB_USERNAME: Joi.string(),
  MONGODB_PASSWORD: Joi.string(),

  NEST_PORT: Joi.number().default(3200),

  APP_URL: Joi.string().default('http://localhost:3000'),
})

/**
 * Custom function to validate environment variables. It takes an object containing environment variables as input and outputs validated environment variables.
 *
 * @param {Record<string, any>} config - Description of the parameter.
 * @returns {Record<string, any>} Description of the return value.
 * @throws {Error} Description of the exception.
 */
export function validateConfig(config: Record<string, any>) {
  console.log(config)
  const { error, value } = configSchema.validate(config, {
    allowUnknown: true,
    cache: true,
    convert: true,
  })
  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }
  return value
}
