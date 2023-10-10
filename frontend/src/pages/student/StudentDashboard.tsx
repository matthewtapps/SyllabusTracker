import { Technique, User } from "common"
import { Box } from "@mui/material"
import NavBar from "../../components/NavBar"
import data from './TestData'
import ModulesList from "../../components/ModulesList"

const testModule: Technique[] = data as Technique[];

function studentDashboard(user: User): React.ReactNode {
    return (
    <div>
        <Box sx={{ flexGrow: 1 }}>
            <NavBar text="Dashboard"/>
        </Box>
        <Box>
            <ModulesList listItems={testModule} title={"Modules"} firstName={user.firstName}/>
        </Box>
    </div>
);};

export  { studentDashboard };
