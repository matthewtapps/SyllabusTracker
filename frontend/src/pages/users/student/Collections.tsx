import { User } from '@auth0/auth0-react';
import { StudentCollectionListWithFilters } from '../../../components/Lists/StudentCollectionListWithFilters';


function StudentCollections(selectedStudent: User): JSX.Element {
    return (
        <div>
            <StudentCollectionListWithFilters selectedStudent={selectedStudent}/>
        </div>
    );
};

export default StudentCollections
