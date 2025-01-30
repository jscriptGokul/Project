const Joi = require("joi");

function validateMessage(message) {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        text: Joi.string().min(1).required()
    });

    return schema.validate(message);
}

module.exports = { validateMessage };


// validators/messageValidator.js
