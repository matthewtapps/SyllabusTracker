import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../../components/Base/BaseLayout';
import { RootState } from '../../store/store';
import SelectedStudentCollections from '../users/coach/SelectedStudentCollections';


const SelectedStudentCollectionsPage: React.FC = () => {
    const navigate = useNavigate();

    const { selectedStudent } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (!selectedStudent) {
            navigate('/')
        }
    }, [selectedStudent, navigate]);

    return (
        <BaseLayout text={`${selectedStudent?.name} Collections`}>
            <div className="home-container">
                <SelectedStudentCollections />
            </div>
        </BaseLayout>
    );
};

export default SelectedStudentCollectionsPage;
