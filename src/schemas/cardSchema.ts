import joi from 'joi';

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

const cardSchema = {
    createCardSchema
}

export default cardSchema;
