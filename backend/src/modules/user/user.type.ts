export enum UserRole {
    Admin = 'admin',
    Doctor = 'doctor',
    Patient = 'patient'
}   

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserDocument {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}