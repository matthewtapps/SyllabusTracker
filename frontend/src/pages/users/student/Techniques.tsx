import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Technique } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import TechniqueList from '../../../components/Lists/TechniqueList'
import TechniqueFilter, { useDetermineTechniqueFilterOptions, useHandleTechniqueFilterChange } from '../../../components/Lists/TechniqueFilter'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchTechniques } from '../../../util/Utilities'

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
    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No technique data available')

    // List of techniques state
    const [techniquesList, setTechniquesList] = React.useState<Technique[]>([])

    const { getAccessTokenSilently } = useAuth0();

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();

                const techniques = await fetchTechniques(token);
                if (techniques) {
                    setTechniquesList(techniques);
                    setLoading(false);                    
                }

            } catch (error) {
                console.log(error);
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
                setLoading(false)
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently]);

    // Generate options for the filters based on the full techniques list
    const options = useDetermineTechniqueFilterOptions(techniquesList)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredTechniques, handleTechniqueFilterChange: handleFilterChange } = useHandleTechniqueFilterChange(techniquesList)

    return (
        <div>
            <Card>
                <TechniqueFilter 
                onTechniqueFiltersChange={handleFilterChange} 
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
                <TechniqueList filteredTechniques={filteredTechniques}/>
            )}
            </Card>
        </div>
    );
};

export default StudentTechniques
