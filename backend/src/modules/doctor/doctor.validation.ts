import joi from 'joi';

const SPECIALIZATIONS = [
    'General Practice',
    'Cardiology',
    'Pediatrics',
    'Dermatology',
    'Orthopedics',
    'Neurology',
    'Gynecology',
    'Psychiatry',
    'Dentistry',
    'Other'
];

export const DoctorSchema = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    specialization: joi.string().valid(...SPECIALIZATIONS).required(),
    password: joi.string().min(6).allow('', null).optional()
})