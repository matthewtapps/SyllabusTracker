import MuiArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import MuiTypography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Typography = styled(MuiTypography)({
    '&.DashboardCard-heading': {
        padding: "10px",
    },
})

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        backgroundColor: "#3c3836",
        border: "1px",
        borderRadius: "2",
    }
});

const ArrowForwardIosIcon = styled(MuiArrowForwardIosIcon)({
    paddingRight: "8px",
    fontSize: "2em"
});

const StudentDashboard: React.FC = () => {

    const navigate = useNavigate();
    const navigateToTechniques = () => { navigate('/techniques') }
    const navigateToCollections = () => { navigate('/collections') }
    
    return (
        <div>
            <Grid container spacing={1} padding={1}>
                <Grid item xs={12}>
                    <Card>
                        <Typography variant='h6' className="DashboardCard-heading">Progress</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card onClick={navigateToTechniques}>
                        <CardActionArea>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant='h6' className="DashboardCard-heading">Techniques</Typography>
                                <ArrowForwardIosIcon/>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card onClick={navigateToCollections}>
                        <CardActionArea>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant='h6' className="DashboardCard-heading">Collections</Typography>
                                <ArrowForwardIosIcon/>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default StudentDashboard;
