import { Role } from './Types'

export interface User {
    userId: number;
    role: Role;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    mobile: string;
}
