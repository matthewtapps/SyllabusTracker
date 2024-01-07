import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../../components/Base/BaseLayout';
import { RootState } from '../../store/store';
import SelectedStudentDashboard from '../users/coach/SelectedStudentDashboard';


const SelectedStudentDashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const { selectedStudent } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (!selectedStudent) {
            navigate('/')
        }
    }, [selectedStudent, navigate]);

    return (
        <BaseLayout text={selectedStudent?.name || "Student selection error"}>
            <div className="home-container">
                <SelectedStudentDashboard />
            </div>
        </BaseLayout>
    );
};

export default SelectedStudentDashboardPage;
