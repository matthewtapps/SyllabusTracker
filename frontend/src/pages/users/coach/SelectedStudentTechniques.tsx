import React from 'react'
import { useSelector } from 'react-redux'
import { StudentTechniqueListWithFilters } from '../../../components/Lists/StudentTechniqueListWithFilters'
import { RootState } from '../../../store/store'
import { useNavigate } from 'react-router-dom'


function SelectedStudentTechniques(): JSX.Element {
    const navigate = useNavigate();
    const { selectedStudent } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (!selectedStudent) {
            navigate('/')
        }
    }, [selectedStudent, navigate]);

    return (
        <StudentTechniqueListWithFilters
            editable
        />
    );
};

export default SelectedStudentTechniques;
