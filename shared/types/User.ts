import { Role } from './enums/Role'

export interface User {
    userId: number;
    role: Role;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    mobile: string;
}
