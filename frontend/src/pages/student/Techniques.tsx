import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Technique } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import TechniquesList from '../../components/TechniqueList'
import TechniqueFilter, { useDetermineFilterOptions, useHandleFilterChange } from '../../components/TechniqueFilter'


const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

function StudentTechniques(): JSX.Element {
    const navigate = useNavigate();
    const navigateToNewTechnique = () => { navigate('/newtechnique') }

    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No technique data available')

    // List of techniques state
    const [techniquesList, setTechniquesList] = React.useState<Technique[]>([])

    React.useEffect(() => {
        (async () => {
            try {
                const [techniqueResponse] = await Promise.all([
                    fetch('http://192.168.0.156:3000/api/technique')
                ]);

                const techniques: Technique[] = await (techniqueResponse.json())
                setTechniquesList(techniques)
                
                setLoading(false)

            } catch (error) {
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
                
                setLoading(false)
            }
        })();
    }, []);

    // Generate options for the filters based on the full techniques list
    const options = useDetermineFilterOptions(techniquesList)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleFilterChange } = useHandleFilterChange(techniquesList)

    return (
        <div>
            <Card>
                <TechniqueFilter 
                onFiltersChange={handleFilterChange} 
                options={options}/>
            </Card>
            <Card>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : filteredTechniques.length === 0 ? (
                <CardContent>
                    <Typography>{placeholderContent}</Typography>
                </CardContent>
            ) : (
                <TechniquesList filteredTechniques={filteredTechniques}/>
            )}
            </Card>
            <Fab // Should only exist on coach version of techniques
            color="primary" 
            aria-label="add" 
            style={{position: 'fixed', bottom: '16px', right: '16px'}}
            onClick={navigateToNewTechnique}
            >
                <AddIcon/>
            </Fab>
        </div>
    );
};

export default StudentTechniques
