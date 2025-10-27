import Joi from 'joi';

export const depositSchema = Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    note: Joi.string().allow('', null),
});

export const withdrawSchema = Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    note: Joi.string().allow('', null),
});
