import { User } from '@auth0/auth0-react';
import { StudentTechniqueListWithFilters } from '../../../components/Lists/StudentTechniqueListWithFilters'


function StudentTechniques(selectedStudent: User): JSX.Element {
    return (
        <StudentTechniqueListWithFilters selectedStudent={selectedStudent} />
    );
};

export default StudentTechniques
