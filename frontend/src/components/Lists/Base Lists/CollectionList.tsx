import Edit from '@mui/icons-material/Edit';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Collection, CollectionTechnique, Technique } from 'common';
import React from 'react';
import DragDropTechniquesList from './DragDropTechniques';
import TechniqueList from './TechniqueList';


const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    },
    '&:not(:last-child)': {
        borderBottom: '1px solid #7c6f64'
    }
});

const SubAccordion = styled(MuiAccordion)({
    backgroundColor: `inherit`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

const ListItem = styled(MuiListItem)({
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px"
})

const BaseListItemText: React.FC<ListItemTextProps> = (props) => {
    return (
        <MuiListItemText
            {...props}
            secondaryTypographyProps={{ component: 'div' }}
            primaryTypographyProps={{ component: 'div' }}
        />
    );
}

const ListItemText = styled(BaseListItemText)<ListItemTextProps>(({ theme }) => {
    let primaryVariant = 'h6';
    let secondaryVariant = 'body1';

    return {
        '& .MuiTypography-root': {
            variant: primaryVariant
        },
        '& .MuiTypography-colorTextSecondary': {
            variant: secondaryVariant
        }
    };
});

const SubCard = styled(MuiCard)({
    backgroundColor: 'inherit'
})

const Button = styled((props: ButtonProps) => (
    <MuiButton sx={{ width: "80px", marginBottom: "10px" }} variant='contained' {...props} />
))(({ theme }) => ({}));

interface CollectionsListProps {
    filteredCollections: Collection[];
    elevation: number;
    editableTechniques: boolean;
    orderedTechniques: boolean;
    onTechniqueEditClick?: (technique: Technique) => void;
    lastAddedCollectionId: string | null;
    onAccordionChange: () => void;
    editableCollection: boolean;
    editingTechniquesCollection: Collection | null;
    onCollectionTechniqueEditClick?: (collection: Collection) => void;
    onCollectionEditClick?: (collection: Collection) => void;
    dragDropTechniques: { index: number, technique: Technique }[] | null;
    onReorderDragDropTechniques?: (newOrder: { index: number, technique: Technique }[]) => void;
    onDragDropSaveClick?: (collectionId: string) => void;
    onDragDropCancelClick?: () => void;
    onAddNewTechniqueClick?: () => void;
    onDragDropDeleteClick?: (deletedTechnique: { index: number, technique: Technique }) => void;
}

CollectionList.defaultProps = {
    elevation: 3,
    editableCollection: false,
    editableTechniques: false,
    orderedTechniques: true,
    editingTechniquesCollection: null,
    dragDropTechniques: null,
}

function CollectionList(props: CollectionsListProps): JSX.Element {
    return (
        <>
            {props.filteredCollections.map(collection => {
                let unsortedTechniques: CollectionTechnique[] = []
                if (collection.collectionTechniques) {
                    unsortedTechniques = [...collection.collectionTechniques];
                }
                let collectionTechniques: Technique[] = []
                unsortedTechniques.sort((a, b) => a.order - b.order)
                unsortedTechniques.forEach(collectionTechnique => {
                    collectionTechniques.push(collectionTechnique.technique)
                });
                return (
                    <Accordion disableGutters elevation={props.elevation} key={collection.collectionId} expanded={props.lastAddedCollectionId ? props.lastAddedCollectionId === collection.collectionId : undefined}
                        onChange={props.onAccordionChange}>
                        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                    <Typography variant="h6">{collection.title}</Typography>
                                    {props.editableCollection && (
                                        <Edit onClick={(event) => { event.stopPropagation(); props.onCollectionEditClick?.(collection); }} />
                                    )}
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SubCard elevation={0}>
                                <SubAccordion elevation={0} disableGutters square defaultExpanded>
                                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                        <ListItem key={`${collection.collectionId}-collection-techniques`}>
                                            <Box display="flex" alignItems="center" justifyContent="flex-start" width="97%">
                                                <ListItemText primary="Collection Techniques" />
                                                {props.editableCollection && (
                                                    <Edit onClick={(event) => { event.stopPropagation(); props.onCollectionTechniqueEditClick?.(collection); }} />
                                                )}
                                            </Box>
                                        </ListItem>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: "0px" }}>
                                        {(props.editingTechniquesCollection?.collectionId === collection.collectionId) && props.dragDropTechniques && props.onReorderDragDropTechniques ?
                                            <Box>
                                                <DragDropTechniquesList
                                                    selectedTechniques={props.dragDropTechniques}
                                                    onReorder={props.onReorderDragDropTechniques}
                                                    onAddTechniqueClick={props.onAddNewTechniqueClick}
                                                    onDragDropDeleteClick={props.onDragDropDeleteClick}
                                                    editable />
                                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                                    <Button
                                                        type="submit"
                                                        onClick={(event) => { event.stopPropagation(); props.onDragDropSaveClick?.(props.editingTechniquesCollection?.collectionId || "") }}>
                                                        Save
                                                    </Button>
                                                    <Button onClick={(event) => { event.stopPropagation(); props.onDragDropCancelClick?.(); }}>Cancel</Button>
                                                </Box>
                                            </Box>
                                            : <TechniqueList
                                                filteredTechniques={collectionTechniques}
                                                elevation={0}
                                                ordered={props.orderedTechniques}
                                                editable={props.editableTechniques}
                                                onEditClick={props.onTechniqueEditClick}
                                            />
                                        }
                                    </AccordionDetails>
                                </SubAccordion>

                                <ListItem key={`${collection.collectionId}-description`}>
                                    <ListItemText primary="Description" secondary={collection?.description} />
                                </ListItem>

                                {collection.globalNotes && (
                                    <ListItem key={`${collection.collectionId}-global-notes`}>
                                        <ListItemText primary="Global Notes" secondary={collection.globalNotes} />
                                    </ListItem>
                                )}

                                {collection.position && (
                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${collection.collectionId}-position`}>
                                                <ListItemText primary="Position" secondary={collection.position?.title} />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${collection.collectionId}-position-description`}>
                                                <ListItemText secondary={collection.position?.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>
                                )}

                                {collection.hierarchy && (
                                    <ListItem key={`${collection.collectionId}-hierarchy`}>
                                        <ListItemText primary=" Hierarchy" secondary={collection.hierarchy} />
                                    </ListItem>
                                )}

                                {collection.type && (
                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${collection.collectionId}-type`}>
                                                <ListItemText primary="Type" secondary={collection.type?.title} />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${collection.collectionId}-type-description`}>
                                                <ListItemText secondary={collection.type?.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>
                                )}

                                {collection.openGuard && (
                                    <SubAccordion elevation={0} disableGutters square>
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${collection.collectionId}-open-guard`}>
                                                <ListItemText primary="Open Guard" secondary={collection.openGuard?.title} />
                                            </ListItem>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ padding: "0px", margin: "0px" }}>
                                            <ListItem key={`${collection.collectionId}-open-guard-description`}>
                                                <ListItemText secondary={collection.openGuard?.description} />
                                            </ListItem>
                                        </AccordionDetails>
                                    </SubAccordion>
                                )}

                                {(collection.gi) && (
                                    <ListItem key={`${collection.collectionId}-gi`}>
                                        <ListItemText primary="Gi or No Gi" secondary={collection.gi} />
                                    </ListItem>
                                )}

                            </SubCard>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </>
    )
}

export default CollectionList
