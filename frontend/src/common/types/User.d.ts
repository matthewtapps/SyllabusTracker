import { Role } from './Types';
export interface User {
    userId: string;
    role: Role;
    name: string;
    email: string;
}
