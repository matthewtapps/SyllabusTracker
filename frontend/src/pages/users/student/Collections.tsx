import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CollectionListWithFilters } from '../../../components/Lists/CollectionListWithFilters'
import { setAccessToken } from '../../../slices/auth'
import { fetchCollectionTechniquesAsync } from '../../../slices/collectionTechniques'
import { AppDispatch, RootState } from '../../../store/store'


function StudentCollections(): JSX.Element {
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token))

            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch]);

    const { collectionTechniques } = useSelector((state: RootState) => state.collectionTechniques)

    React.useEffect(() => {
        if (collectionTechniques.length < 1) {
            dispatch(fetchCollectionTechniquesAsync());
        }
    }, [dispatch, collectionTechniques.length]);

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
