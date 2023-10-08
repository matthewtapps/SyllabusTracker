import { User } from '../types/User'
import { Role } from '../types/enums/Role'

export function fetchUser(): User {
    let user: User = {
        userId: 1,
        role: Role.Student,
        firstName: 'Example',
        lastName: 'Student',
        dateOfBirth: new Date(1963, 1, 24),
        email: 'example@example.com',
        mobile: '0400000000'
    }
    return user
}
