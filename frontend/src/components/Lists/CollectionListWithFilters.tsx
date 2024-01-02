import { Box, CircularProgress, CardContent, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card'
import CollectionList from "./Base Lists/CollectionList";
import CollectionFilter, { useHandleCollectionFilterChange } from "./List Filters/CollectionFilter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { setAccessToken } from "../../slices/auth";
import { fetchCollectionsAsync } from "../../slices/collections";
import { fetchCollectionSuggestionsAsync } from "../../slices/suggestions";
import { Technique, Collection } from "common";


const Card = styled(MuiCard)({
    '&.MuiCard-root': {
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
        borderRadius: "2",
        boxShadow: "3"
    }
});

interface CollectionListWithFiltersProps {
    onAccordionChange: (collectionId: string) => void;
    expandedCollectionId: string;
    editable: boolean;
    editingTechniquesCollection?: Collection | null;
    onTechniqueEditClick?: (technique: Technique) => void;
    onCollectionTechniqueEditClick?: (collection: Collection) => void;
    onCollectionEditClick?: (collection: Collection) => void;
    dragDropTechniques?: {index: number, technique: Technique}[] | null;
    onReorderDragDropTechniques?: (newOrder: {index: number, technique: Technique}[]) => void;
    onDragDropSaveClick?: (collectionId: string) => void;
    onDragDropCancelClick?: () => void;
    onDragDropDeleteClick?: (deletedTechnique: {index: number, technique: Technique}) => void;
    onOpenAddTechniqueDialogue?: () => void;
}

CollectionListWithFilters.defaultProps = {
    editable: false,

}

export function CollectionListWithFilters(props: CollectionListWithFiltersProps): JSX.Element {
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();
    const [placeholderContent, setPlaceholderContent] = React.useState('')

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token))

            } catch (error) {
                console.log(error);
                setPlaceholderContent(`Error fetching data: ${error}, \n please screenshot this and send to Matt`)
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch]);

    const { collections, loading, error } = useSelector((state: RootState) => state.collections);
    const { collectionSuggestions } = useSelector((state: RootState) => state.suggestions);

    React.useEffect(() => {
        if (collections.length < 1 && !loading) {
            dispatch(fetchCollectionsAsync());
        }
        if (!collectionSuggestions) {
            dispatch(fetchCollectionSuggestionsAsync())
        }
        if (error) {
            setPlaceholderContent(`Error fetching collections in Redux: ${error}`)
        }
    }, [dispatch, error, collections.length, collectionSuggestions, loading]);

    const { filteredCollections, handleCollectionFilterChange } = useHandleCollectionFilterChange(collections)

    return (
        <>
            <Card>
                <CollectionFilter
                    onCollectionFiltersChange={handleCollectionFilterChange}
                    options={collectionSuggestions} />
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
                    <Box>
                        <CollectionList
                            editableCollection={props.editable}
                            filteredCollections={filteredCollections}
                            editableTechniques={props.editable}
                            onTechniqueEditClick={props.onTechniqueEditClick}
                            editingTechniquesCollection={props.editingTechniquesCollection}
                            expandedCollectionId={props.expandedCollectionId}
                            onAccordionChange={props.onAccordionChange}
                            onCollectionTechniqueEditClick={props.onCollectionTechniqueEditClick}
                            onCollectionEditClick={props.onCollectionEditClick}

                            onReorderDragDropTechniques={props.onReorderDragDropTechniques}
                            dragDropTechniques={props.dragDropTechniques}
                            onDragDropSaveClick={props.onDragDropSaveClick}
                            onDragDropCancelClick={props.onDragDropCancelClick}
                            onAddNewTechniqueClick={props.onOpenAddTechniqueDialogue}
                            onDragDropDeleteClick={props.onDragDropDeleteClick} />
                    </Box>
                )}
            </Card>
        </>
    )
};
