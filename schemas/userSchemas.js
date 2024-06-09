import Joi from "joi";

export const validateUserSchema = Joi.object({
    email: Joi.string().email().required(),
})