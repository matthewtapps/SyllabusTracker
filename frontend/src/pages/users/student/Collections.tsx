import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Collection } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CollectionList from '../../../components/CollectionList'
import CollectionFilter, { useDetermineCollectionFilterOptions, useHandleCollectionFilterChange } from '../../../components/CollectionFilter'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchCollections } from '../../../util/Utilities'

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
    // Whether content is loading or not state
    const [loading, setLoading] = React.useState(true);
    const [placeholderContent, setPlaceholderContent] = React.useState('No collection data available')

    // List of techniques state
    const [collectionsList, setCollectionsList] = React.useState<Collection[]>([])

    const { getAccessTokenSilently } = useAuth0();

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();

                const collections = await fetchCollections(token);
                if (collections) {
                    setCollectionsList(collections);
                    setLoading(false);
                }

            } catch (error) {
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
                console.log(error);
                setLoading(false)
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently]);

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
        </div>
    );
};

export default StudentCollections
