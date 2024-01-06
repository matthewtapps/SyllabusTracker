import { User } from '@auth0/auth0-react';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pageloader from '../../../components/Base/PageLoader';
import StudentList from '../../../components/Lists/Base Lists/StudentList';
import { useGetStudentsQuery } from '../../../services/syllabusTrackerApi';
import { selectStudent } from '../../../slices/student';
import { AppDispatch } from '../../../store/store';


const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

const CoachStudents: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const handleNavigateToSelectedStudentHome = (student: User) => {
        dispatch(selectStudent(student))
        navigate('/student')
    }

    const { data: students, isLoading, isSuccess, error } = useGetStudentsQuery()

    return (
        <div>
            {isLoading ? <Card><Pageloader /></Card>
                : isSuccess ? <Card><StudentList students={students} onSelectStudent={handleNavigateToSelectedStudentHome} /></Card>
                    : <Card><CardContent><Typography>{`Student data failed to fetch: ${error}`}</Typography></CardContent></Card>
            }
        </div>
    )
}

export default CoachStudents
