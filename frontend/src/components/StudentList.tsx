import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiListItem from '@mui/material/ListItem';
import { User } from '@auth0/auth0-react';
import MuiCard from '@mui/material/Card'
import ListItemText from '@mui/material/ListItemText'


const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    },
    '&:not(:last-child)': {
        borderBottom: '1px solid #7c6f64'
    }
});

const ListItem = styled(MuiListItem)({
    paddingTop: "0px",
    paddingLeft: "0px",
    '&.MuiListItem-root.Mui-selected': {
        backgroundColor: 'inherit'
    }
})

const SubCard = styled(MuiCard)({
    backgroundColor: 'inherit',
})

interface StudentListProps {
    students: User[]
}

function StudentList(props: StudentListProps): JSX.Element {
    return (
        <div>
        {props.students.map((student, index) => {
            console.log(student)
            return (
                <Accordion disableGutters key={student.user_id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1a-content"
                    >
                        <Box display="flex" flexDirection="row" width="100%">
                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                        <Box display="flex" alignItems="center" marginLeft="0px">
                                            <Typography variant="body1">{student.name}</Typography>
                                        </Box>
                                </Box>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SubCard elevation={0}>
                            <ListItem>                                
                                <ListItemText sx={{margin: "0px"}}
                                primary="Email"
                                secondary={student.email}
                                />
                            </ListItem>
                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )
        })
    }
    </div>
    )
}

export default StudentList
