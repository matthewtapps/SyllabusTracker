import React from 'react';
import NavBar from '../../components/NavBar';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { styled } from '@mui/material/styles';
import MuiTypography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MuiArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'

const Typography = styled(MuiTypography)({
    '&.DashboardCard-heading': {
        padding: "10px",
    },
})

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        backgroundColor: "#3c3836",
        color: "#fbf1c7",
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        border: "1px",
        borderRadius: "2",
    }
});

const ArrowForwardIosIcon = styled(MuiArrowForwardIosIcon)({
    paddingRight: "8px",
    fontSize: "2em"
});

function StudentDashboard(): React.ReactNode {
    const navigate = useNavigate();
    const navigateToTechniques = () => { navigate('/techniques') }
    const navigateToModules = () => { navigate('/') }

    return (
    <div>
        <NavBar text="Dashboard"/>
        <Grid container>
            <Grid xs={12}>
                <Card>
                    <Typography variant='h6' className="DashboardCard-heading">Progress</Typography>
                </Card>
            </Grid>
            <Grid xs={6}>
                <Card onClick={navigateToTechniques}>
                    <CardActionArea>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant='h6' className="DashboardCard-heading">Techniques</Typography>
                            <ArrowForwardIosIcon/>
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid xs={6}>
                <Card onClick={navigateToModules}>
                    <CardActionArea>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant='h6' className="DashboardCard-heading">Modules</Typography>
                            <ArrowForwardIosIcon/>
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
    </div>
);};

export default StudentDashboard;
