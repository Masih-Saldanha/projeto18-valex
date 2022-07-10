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
    ).required(),
});

const activateCardSchema = joi.object({
    // id = id do Card
    id: joi.number().integer().required(),
    securityCode: joi.string().required(),
    password: joi.string().pattern(cardUtils.cardPasswordRegex).required()
});

const cardSchema = {
    createCardSchema,
    activateCardSchema
}

export default cardSchema;
