import joi from 'joi';

import cardUtils from '../utils/cardUtils.js';

const paymentSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().pattern(cardUtils.cardPasswordRegex).required(),
    amount: joi.number().integer().min(1).required(),
    businessId: joi.number().integer().required()
});

const blockSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().pattern(cardUtils.cardPasswordRegex).required()
});

const employeeSchema = {
    paymentSchema,
    blockSchema
};

export default employeeSchema;
