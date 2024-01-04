import { User } from '@auth0/auth0-react';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pageloader from '../../../components/Base/PageLoader';
import StudentList from '../../../components/Lists/Base Lists/StudentList';
import { fetchStudentsAsync, selectStudent } from '../../../slices/student';
import { AppDispatch, RootState } from '../../../store/store';


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

    const { students, loading } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (students.length < 1) {
            dispatch(fetchStudentsAsync());
        };
    },[dispatch, students]);

    return (
        <div>
            {!loading ?
                students.length > 0 ?
                    <Card><StudentList students={students} onSelectStudent={handleNavigateToSelectedStudentHome} /></Card>
                    : <Card><CardContent><Typography>Empty student data received (this probably shouldn't happen)</Typography></CardContent></Card>
                : <Card><Pageloader/></Card>}
        </div>
    )
}

export default CoachStudents
