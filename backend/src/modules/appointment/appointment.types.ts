export interface Appointment{
    id:string
    doctorId:string
    patientId:string
    date:string
    time:string
    status:AppointmentStatus
    createdAt:Date
}

export interface CreateAppointmentInput{
    doctorId:string
    patientId:string
    date:string
    time:string
}

export enum AppointmentStatus {
    Booked = 'booked',
    Cancelled = 'cancelled',
    Completed = 'completed'
}