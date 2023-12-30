import React from 'react';
import BaseLayout from '../../components/Base/BaseLayout';
import { useStudent } from '../../components/Contexts/SelectedStudentContext';
import { useNavigate } from 'react-router-dom';
import SelectedStudentTechniques from '../users/coach/SelectedStudentTechniques';


const SelectedStudentTechniquesPage: React.FC = () => {
    const { selectedStudent } = useStudent();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (selectedStudent === null) {
            navigate('/');
        }
    }, [selectedStudent, navigate]);

    return (
        <BaseLayout text={`${selectedStudent?.name} Techniques`}>
            <div className="home-container">
                <SelectedStudentTechniques/>
            </div>
        </BaseLayout>
    );
};

export default SelectedStudentTechniquesPage;
