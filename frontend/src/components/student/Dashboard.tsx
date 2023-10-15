import { User } from "common"
import Grid from "@mui/material/Unstable_Grid2"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Card"
import NavBar from "../NavBar"

function StudentDashboard(user: User): React.ReactNode {
    return (
    <div>
        <NavBar text="Home"/>
        <Card sx={{backgroundColor: "#3c3836", 
                color: "#fbf1c7", 
                marginX: 2,
                marginY: 1,
                paddingY: 0,
                border: 1,
                borderRadius: 2,
                boxShadow: 4}}>
                <Typography sx={{ fontSize: 14, backgroundColor: "#3c3836", 
                color: "#fbf1c7" }} color="text.primary">
                    Student Dashboard
                </Typography>
                <Typography sx={{ fontSize: 14, backgroundColor: "#3c3836", 
                        color: "#fbf1c7" }}>
                Hi {user.firstName}!
                </Typography>
        </Card>
        <Grid container spacing={1}>
            <Grid xs={6}>
                <Card sx={{backgroundColor: "#3c3836", 
                    color: "#fbf1c7", 
                    marginX: 2,
                    marginRight: 1,
                    marginY: 1,
                    paddingY: 0,
                    border: 1,
                    borderRadius: 2,
                    boxShadow: 4}}>
                        <Typography sx={{ fontSize: 14, backgroundColor: "#3c3836", 
                        color: "#fbf1c7" }} color="text.primary">
                            Student Dashboard
                        </Typography>
                        <Typography sx={{ fontSize: 14, backgroundColor: "#3c3836", 
                        color: "#fbf1c7" }}>
                        Hi {user.firstName}!
                        </Typography>
                </Card>
            </Grid>
            <Grid xs={6}>
                <Card sx={{backgroundColor: "#3c3836", 
                    color: "#fbf1c7", 
                    marginX: 2,
                    marginY: 1,
                    marginLeft: 1,
                    paddingY: 0,
                    border: 1,
                    borderRadius: 2,
                    boxShadow: 4}}>
                        <Typography sx={{ fontSize: 14, backgroundColor: "#3c3836", 
                        color: "#fbf1c7" }} color="text.primary">
                            Student Dashboard
                        </Typography>
                        <Typography sx={{ fontSize: 14, backgroundColor: "#3c3836", 
                        color: "#fbf1c7" }}>
                        Hi {user.firstName}!
                        </Typography>
                </Card>
            </Grid>
        </Grid>
    </div>
);};

export  { StudentDashboard };
