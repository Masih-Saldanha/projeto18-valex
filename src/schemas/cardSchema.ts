import joi from 'joi';

import cardUtils from '../utils/cardUtils.js';

const createCardSchema = joi.object({
    employeeId: joi.number().integer().required(),
    type: joi.string().valid(
        "groceries",
        "restaurant",
        "transport",
        "education",
        "health",
    ).required()
});

const activateCardSchema = joi.object({
    id: joi.number().integer().required(),
    securityCode: joi.string().pattern(cardUtils.cardCVVRegex).required(),
    password: joi.string().pattern(cardUtils.cardPasswordRegex).required()
});

const rechargeCardSchema = joi.object({
    id: joi.number().integer().required(),
    rechargeValue: joi.number().integer().min(1).required()
});

const cardSchema = {
    createCardSchema,
    activateCardSchema,
    rechargeCardSchema
};

export default cardSchema;
