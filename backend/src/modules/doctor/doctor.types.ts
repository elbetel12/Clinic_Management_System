export interface CreateDoctorInput  {
    userId: string;
    name: string;
    email: string;
    specialization: string;
}

export interface DoctorDocument {
    _id: string;
    user: string;
    name: string;
    email: string;
    specialization: string;
    bio?: string;
    experience?: number;
    createdAt: Date;
    updatedAt: Date;
}