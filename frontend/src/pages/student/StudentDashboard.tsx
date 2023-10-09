import { Technique, User } from "common"
import { Box } from "@mui/material"
import NavBar from "../../components/NavBar"
import AccordionList from "../../components/AccordionList"
import data from './TestData'

const testModule: Technique[] = data as Technique[];

function studentDashboard(user: User): React.ReactNode {
    return (
    <div>
        <Box sx={{ flexGrow: 1 }}>
            <NavBar text="Dashboard"/>
        </Box>
        <Box>
        <AccordionList props={testModule}/>
        </Box>

        <p>Hello Student!</p>
        <p>Dashboard goes here</p>
        <p>{user.firstName}
        {user.lastName}
        {user.email}
        {user.role}
        {user.userId}</p>
    </div>
);
};

export  { studentDashboard };
