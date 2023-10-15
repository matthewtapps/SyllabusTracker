import { Role } from './Types'

export interface User {
    userId: string;
    role: Role;
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    mobile: string;
}
