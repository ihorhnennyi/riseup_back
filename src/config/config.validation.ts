import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
});
