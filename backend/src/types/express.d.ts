import { JwtPayload } from "../modules/auth/auth.types";

// Empty export to make TypeScript treat this as a module
export {};

declare global {
    namespace Express {
        export interface Request {
            user?: JwtPayload;
        }
    }
}