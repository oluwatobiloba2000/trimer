import Joi from 'joi';

export const validateUrl = (obj) => {
    const JoiSchema = Joi.object({
        original_url: Joi.string().regex(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
          ).error(new Error('Enter a valid URL')).required(),
        clipped_url_id: Joi.string().min(2).max(100).optional(),
    });
    return JoiSchema.validate(obj);
}

export const validateId = (obj)=> {
    const JoiSchema = Joi.object({
        id: Joi.string().min(24).max(24).required(),
    });
    return JoiSchema.validate(obj);
}

export const validateAuth = (obj)=> {
    const JoiSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required()
    });
    return JoiSchema.validate(obj);
}

