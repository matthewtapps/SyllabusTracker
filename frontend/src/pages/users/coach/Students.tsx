import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useAuth0, User } from '@auth0/auth0-react';
import React from 'react';
import StudentList from '../../../components/Lists/Base Lists/StudentList';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../../../slices/auth';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchStudentsAsync, selectStudent } from '../../../slices/student';
import Pageloader from '../../../components/Base/PageLoader';


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
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const handleNavigateToSelectedStudentHome = (student: User) => {
        dispatch(selectStudent(student))
        navigate('/student')
    }

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token))

            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch]);

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
