import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { User } from '@auth0/auth0-react';
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import IconButton from '@mui/material/IconButton';


interface StudentListProps {
    students: User[],
    onSelectStudent: (student: User) => void;
}

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        backgroundColor: "#3c3836",
        borderRadius: "2",
    }
});

function StudentList(props: StudentListProps): JSX.Element {
    const handleSelectStudent = (student: User) => {
        return () => {
            props.onSelectStudent(student);
        };
    }

    return (
        <Card>
            {props.students.map((student, index) => (
                <CardContent key={student.email}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">{student.name}</Typography>
                        <IconButton color="inherit" onClick={handleSelectStudent(student)}>
                            <ArrowForwardIosOutlinedIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            ))}
        </Card>
    );
}

export default StudentList;
