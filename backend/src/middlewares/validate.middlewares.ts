import Joi, { Schema, ValidationError } from "joi";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error,value} = schema.validate(req.body,{
        abortEarly: false, // return all errors
        stripUnknown: true, // remove extra fields
    }
    );
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
        });
    }
    req.body = value; // use the validated and sanitized value
    next();
};

