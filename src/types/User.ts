interface User {
    userId: number;
    role: Role;
    studentId: number | null; // May be blank if user's role is not Role.Student
    email: string;
}
