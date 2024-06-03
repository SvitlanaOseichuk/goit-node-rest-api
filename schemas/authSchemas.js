import Joi from "joi";

export const authSchemaRegister = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    avatarURL: Joi.string().uri().required()
})


export const authSchemaLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})