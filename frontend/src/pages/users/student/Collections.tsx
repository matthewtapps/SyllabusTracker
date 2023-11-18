import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { Collection } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CollectionList from '../../../components/CollectionList'
import CollectionFilter, { useDetermineCollectionFilterOptions, useHandleCollectionFilterChange } from '../../../components/CollectionFilter'

const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

function StudentCollections(): JSX.Element {
    const navigate = useNavigate();
    const navigateToNewCollection = () => { navigate('/newCollection') }

    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No collection data available')

    // List of techniques state
    const [collectionsList, setCollectionsList] = React.useState<Collection[]>([])

    React.useEffect(() => {
        (async () => {
            try {
                const [collectionResponse] = await Promise.all([
                    fetch('http://192.168.0.156:3000/api/collection')
                ]);

                const collections: Collection[] = await (collectionResponse.json())
                setCollectionsList(collections)
                
                setLoading(false)

            } catch (error) {
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
                
                setLoading(false)
            }
        })();
    }, []);

    // Generate options for the filters based on the full techniques list
    const options = useDetermineCollectionFilterOptions(collectionsList)

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredCollections, handleCollectionFilterChange } = useHandleCollectionFilterChange(collectionsList)

    return (
        <div>
            <Card>
                <CollectionFilter 
                onCollectionFiltersChange={handleCollectionFilterChange} 
                options={options}/>
            </Card>
            <Card>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : filteredCollections.length === 0 ? (
                <CardContent>
                    <Typography>{placeholderContent}</Typography>
                </CardContent>
            ) : (
                <CollectionList filteredCollections={filteredCollections}/>
            )}
            </Card>
            <Fab // Should only exist on coach version of techniques
            color="primary" 
            aria-label="add" 
            style={{position: 'fixed', bottom: '16px', right: '16px'}}
            onClick={navigateToNewCollection}
            >
                <AddIcon/>
            </Fab>
        </div>
    );
};

export default StudentCollections
