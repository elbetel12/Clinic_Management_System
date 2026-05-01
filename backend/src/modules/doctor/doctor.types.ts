export interface CreateDoctorInput  {
    name:string;
    specialization:string;
}

export interface DoctorDocument {
    _id:string;
    name:string;
    specialization:string;
    createdAt:Date;
    updatedAt:Date;
}