import React from 'react'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Collection } from 'common'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import CollectionList from '../../../components/Lists/Base Lists/CollectionList'
import CollectionFilter, { useHandleCollectionFilterChange } from '../../../components/Lists/List Filters/CollectionFilter'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchCollections } from '../../../util/Utilities'
import { CollectionListWithFilters } from '../../../components/Lists/CollectionListWithFilters'

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

    // Generated list of filtered techniques which is held at this level, and function for handling filter
    // changes which is passed to the onFiltersChange prop on TechniqueFilter
    const { filteredCollections, handleCollectionFilterChange } = useHandleCollectionFilterChange(collectionsList)

    const [expandedCollectionId, setExpandedCollectionId] = React.useState("");
    const handleAccordionChange = (collectionId: string) => {
        setExpandedCollectionId(prevExpandedCollectionId => 
            prevExpandedCollectionId === collectionId ? "" : collectionId
        );
    }

    return (
        <div>
            <CollectionListWithFilters
            onAccordionChange={handleAccordionChange}
            expandedCollectionId={expandedCollectionId}
            />
        </div>
    );
};

export default StudentCollections
