import Joi from "joi";

export const AppointmentSchema = Joi.object({
  doctorId: Joi.string().required(),

  date: Joi.date().iso().greater("now").required(), // ensures ISO format

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm format
    .required(),

  reason: Joi.string().min(5).max(500).optional(),
});