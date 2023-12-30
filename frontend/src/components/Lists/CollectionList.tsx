import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles'
import { Collection, Technique, CollectionTechnique } from 'common';
import Typography from '@mui/material/Typography';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import MuiCard from '@mui/material/Card';
import TechniqueList from './TechniqueList';
import Box from '@mui/material/Box';
import Edit from '@mui/icons-material/Edit';
import DragDropTechniquesList from './DragDropTechniques';
import MuiButton, { ButtonProps } from '@mui/material/Button';


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
            secondaryTypographyProps={{ component: 'div'}}
            primaryTypographyProps={{ component: 'div'}}
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
    <MuiButton sx={{width: "80px", marginBottom: "10px"}} variant='contained' {...props} />
))(({ theme }) => ({}));

interface CollectionsListProps {
    filteredCollections: Collection[];
    collectionTechniques: CollectionTechnique[] | null;
    elevation: number;
    editableTechniques: boolean;
    orderedTechniques: boolean;
    onTechniqueEditClick?: (technique: Technique) => void;
    editingTechniqueOptions: {
        techniqueTitleOptions: string[],
        techniquePositionOptions: string[],
        techniqueHierarchyOptions: string[],
        techniqueTypeOptions: string[],
        techniqueOpenGuardOptions: string[],
        techniqueGiOptions: string[]
    } | null;
    expandedCollectionId: string;
    onAccordionChange: (collectionId: string) => void;

    editableCollection: boolean;
    editingTechniquesCollection: Collection | null;
    onCollectionTechniqueEditClick?: (collection: Collection) => void;
    onCollectionEditClick?: (collection: Collection) => void;
    dragDropTechniques: {index: number, technique: Technique}[] | null;
    onReorderDragDropTechniques?: (newOrder: {index: number, technique: Technique}[]) => void;
    onDragDropSaveClick?: () => void;
    onDragDropCancelClick?: () => void;
    onAddNewTechniqueClick?: () => void;
    onDragDropDeleteClick?: (deletedTechnique: {index: number, technique: Technique}) => void;
}

CollectionList.defaultProps = {
    elevation: 3,
    collectionTechniques: null,
    editableCollection: false,
    editableTechniques: false,
    orderedTechniques: true,
    checkboxTechniques: false,
    editingTechniquesCollection: null,
    editingCollectionId: null,
    editingCollection: null,
    dragDropTechniques: null,
    editingTechniqueOptions: null,
    editingCollectionOptions: null,
}

function CollectionList(props: CollectionsListProps): JSX.Element {
    return (
        <div>
            {props.filteredCollections.map(collection => {         

                let collectionTechniques: Technique[] = []

                if (props.collectionTechniques) {
                    const filteredAndSortedTechniques = props.collectionTechniques
                        .filter(ct => ct.collection.collectionId === collection.collectionId)
                        .sort((a, b) => a.order - b.order)
                        .map(ct => ct.technique);
                    
                    collectionTechniques = filteredAndSortedTechniques;
                } else {
                    collection.collectionTechniques?.sort((a, b) => a.order - b.order)
                    collection.collectionTechniques?.forEach(collectionTechnique => {
                        collectionTechniques.push(collectionTechnique.technique)
                    });
                }
            return (
                <Accordion disableGutters elevation={props.elevation} key={collection.collectionId} expanded={props.expandedCollectionId === collection.collectionId}
                onChange={() => props.onAccordionChange(collection.collectionId)}>
                    <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                        <Box display="flex" flexDirection="column" flexGrow={1}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                <Typography variant="h6">{collection.title}</Typography>
                                {props.editableCollection && (
                                    <Edit onClick={(event) => { event.stopPropagation(); props.onCollectionEditClick?.(collection); }}/>
                                )}
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SubCard elevation={0}>
                            <SubAccordion elevation={0} disableGutters square defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <Box display="flex" alignItems="center" justifyContent="flex-start" width="97%">
                                            <ListItemText primary="Collection Techniques"/>
                                            {props.editableCollection && (
                                                <Edit onClick={(event) => { event.stopPropagation(); props.onCollectionTechniqueEditClick?.(collection); }}/>
                                            )}
                                        </Box>
                                    </ListItem>
                                </AccordionSummary>
                                <AccordionDetails sx={{padding: "0px"}}>
                                    {(props.editingTechniquesCollection?.collectionId === collection.collectionId) && props.dragDropTechniques && props.onReorderDragDropTechniques ? 
                                        <Box>
                                            <DragDropTechniquesList 
                                            selectedTechniques={props.dragDropTechniques} 
                                            onReorder={props.onReorderDragDropTechniques}
                                            onAddTechniqueClick={props.onAddNewTechniqueClick}
                                            onDragDropDeleteClick={props.onDragDropDeleteClick}
                                            editable/>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                                <Button type="submit" onClick={(event) => { event.stopPropagation(); props.onDragDropSaveClick?.() }}>Save</Button>
                                                <Button onClick={(event) => { event.stopPropagation(); props.onDragDropCancelClick?.(); }}>Cancel</Button>
                                            </Box>
                                        </Box>
                                    :   (<TechniqueList
                                        filteredTechniques={collectionTechniques}
                                        elevation={0}
                                        ordered={props.orderedTechniques}
                                        editable={props.editableTechniques}
                                        onEditClick={props.onTechniqueEditClick}
                                        />)
                                    }
                                </AccordionDetails>
                            </SubAccordion>

                            <ListItem>
                                <ListItemText primary="Description" secondary={collection?.description}/>                                
                            </ListItem>
                                                        
                            {collection.globalNotes && (
                                <ListItem>
                                    <ListItemText primary="Global Notes" secondary={collection.globalNotes}/>
                                </ListItem>
                            )}
    
                            {collection.position && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText primary="Position" secondary={collection.position?.title}/>
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem >
                                            <ListItemText secondary={collection.position?.description}/>
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            {collection.hierarchy && (
                                <ListItem>
                                    <ListItemText primary=" Hierarchy" secondary={collection.hierarchy}/>
                                </ListItem>
                            )}

                            {collection.type && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText primary="Type" secondary={collection.type?.title}/>
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText secondary={collection.type?.description}/>
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            {collection.openGuard && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText primary="Open Guard" secondary={collection.openGuard?.title}/>
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText secondary={collection.openGuard?.description}/>
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            {(collection.gi) && (
                                <ListItem>
                                    <ListItemText primary="Gi or No Gi" secondary={collection.gi} />
                                </ListItem>
                            )}

                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )})}
        </div>
    )
}

export default CollectionList
