export interface CreateLoginInput {
    email : string;
    password : string;
}
export interface JwtPayload {
    userId : string;
    role : 'admin' | 'doctor' | 'patient';
}