import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useAuth0, User } from '@auth0/auth0-react';
import React from 'react';
import { fetchStudents } from '../../../util/Utilities';
import StudentList from '../../../components/Lists/StudentList';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


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

    const [students, setStudents] = React.useState<User[] | null>(null)

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();

                const students = await fetchStudents(token);

                if (students) setStudents(students);
            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently]);

    return (
        <div>
            {students ? 
            students.length > 0 ?
            <Card><StudentList students={students}/></Card>
            : <Card><CardContent><Typography>Empty student data received (this probably shouldn't happen).</Typography></CardContent></Card>
            : <Card><CardContent><Typography>Loading...</Typography></CardContent></Card>}
        </div>
    )
}

export default CoachStudents
