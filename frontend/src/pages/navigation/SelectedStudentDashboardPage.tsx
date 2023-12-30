import React from 'react';
import BaseLayout from '../../components/Base/BaseLayout';
import { useStudent } from '../../components/Contexts/SelectedStudentContext';
import SelectedStudentDashboard from '../users/coach/SelectedStudentDashboard';
import { useNavigate } from 'react-router-dom';


const SelectedStudentDashboardPage: React.FC = () => {
    const { selectedStudent } = useStudent();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (selectedStudent === null) {
            navigate('/');
        }
    }, [selectedStudent, navigate]);

    return (
        <BaseLayout text={selectedStudent?.name || "Student selection error"}>
            <div className="home-container">
                <SelectedStudentDashboard/>
            </div>
        </BaseLayout>
    );
};

export default SelectedStudentDashboardPage;
