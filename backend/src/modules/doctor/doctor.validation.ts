import joi from 'joi';

export const DoctorSchema = joi.object({
    name:joi.string().min(2).max(50).required(),
    specialization:joi.string().min(2).max(100).required()
})