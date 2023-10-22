import { User } from '../types/User'
import { Role } from '../types/enums/Role'
import { Rank } from '../types/Rank'
import { Belt } from '../types/Types'
import { Stripes } from '../types/Types'

export function fetchUser(): User {
    let user: User = {
        userId: '1',
        role: Role.Student,
        username: 'Liam',
        firstName: 'Liam',
        lastName: 'Heaver',
        dateOfBirth: new Date(1963, 1, 24),
        email: 'example@example.com',
        mobile: '0400000000',
        rank: {belt: Belt.White, stripes: Stripes.Four}
    }
    return user
}
