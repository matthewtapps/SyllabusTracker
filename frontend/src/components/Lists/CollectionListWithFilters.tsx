import { Box, CardContent, Typography, styled } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { Collection, Technique } from "common";
import { useGetCollectionsQuery } from "../../services/syllabusTrackerApi";
import Pageloader from "../Base/PageLoader";
import CollectionList from "./Base Lists/CollectionList";
import CollectionFilter, { useHandleCollectionFilterChange } from "./List Filters/CollectionFilter";


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
    onAccordionChange: () => void;
    lastAddedCollectionId: string | null;
    editable: boolean;
    editingTechniquesCollection?: Collection | null;
    onTechniqueEditClick?: (technique: Technique) => void;
    onCollectionTechniqueEditClick?: (collection: Collection) => void;
    onCollectionEditClick?: (collection: Collection) => void;
    dragDropTechniques?: { index: number, technique: Technique }[] | null;
    onReorderDragDropTechniques?: (newOrder: { index: number, technique: Technique }[]) => void;
    onDragDropSaveClick?: (collectionId: string) => void;
    onDragDropCancelClick?: () => void;
    onDragDropDeleteClick?: (deletedTechnique: { index: number, technique: Technique }) => void;
    onOpenAddTechniqueDialogue?: () => void;
}

CollectionListWithFilters.defaultProps = {
    editable: false,

}

export function CollectionListWithFilters(props: CollectionListWithFiltersProps): JSX.Element {
    const { isLoading, isSuccess, isError, error } = useGetCollectionsQuery()

    const { filteredCollections, handleCollectionFilterChange } = useHandleCollectionFilterChange()

    return (
        <>
            <Card>
                <CollectionFilter
                    onCollectionFiltersChange={handleCollectionFilterChange}
                />
            </Card>
            <Card>
                {isLoading ? <Pageloader />
                    : isSuccess ?
                        <Box>
                            <CollectionList
                                editableCollection={props.editable}
                                filteredCollections={filteredCollections}
                                editableTechniques={props.editable}
                                onTechniqueEditClick={props.onTechniqueEditClick}
                                editingTechniquesCollection={props.editingTechniquesCollection}
                                lastAddedCollectionId={props.lastAddedCollectionId}
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
                        : isError ?
                            <CardContent>
                                <Typography>{`Failed to fetch collections: ${error}`}</Typography>
                            </CardContent>
                            :
                            <CardContent>
                                <Typography>No collections available for selected filters.</Typography>
                            </CardContent>
                }
            </Card>
        </>

    )
};
