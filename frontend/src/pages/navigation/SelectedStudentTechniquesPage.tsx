import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../../components/Base/BaseLayout';
import { RootState } from '../../store/store';
import SelectedStudentTechniques from '../users/coach/SelectedStudentTechniques';


const SelectedStudentTechniquesPage: React.FC = () => {
    const navigate = useNavigate();

    const { selectedStudent } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (!selectedStudent) {
            navigate('/')
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
