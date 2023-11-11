import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles'
import { Collection, Technique } from 'common';
import Typography from '@mui/material/Typography';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import MuiCard from '@mui/material/Card';
import TechniqueList from './TechniqueList';
import Box from '@mui/material/Box';
import Edit from '@mui/icons-material/Edit';
import DragDropTechniquesList from './DragDropTechniques';
import MuiButton, { ButtonProps } from '@mui/material/Button'


interface TechniqueDTO {
    title: string,
    videoSrc: string | undefined,
    description: string,
    globalNotes: string | undefined,
    gi: string,
    hierarchy: string,
    type: string,
    typeDescription: string | undefined,
    position: string,
    positionDescription: string | undefined,
    openGuard: string | undefined,
    openGuardDescription: string | undefined,
}

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

const ListItemText = styled(({ ...props }: ListItemTextProps) => (
    <MuiListItemText primaryTypographyProps={{variant: 'body1'}} secondaryTypographyProps={{variant: 'body2'}}{...props} />
))(({ theme }) => ({}))

const SubCard = styled(MuiCard)({
    backgroundColor: 'inherit'
})

const Button = styled((props: ButtonProps) => (
    <MuiButton sx={{width: "80px", marginBottom: "10px"}} variant='contained' {...props} />
))(({ theme }) => ({}));

interface CollectionsListProps {
    filteredCollections: Collection[];
    elevation: number;
    editableTechniques: boolean;
    orderedTechniques: boolean;
    checkboxTechniques: boolean;
    editingTechniqueId?: string | null;
    editingTechnique?: TechniqueDTO | null;
    onTechniqueEditClick?: (technique: Technique) => void;
    onTechniqueSubmitClick?: (event: React.FormEvent<HTMLFormElement>) => void;
    onTechniqueCancelClick?: () => void;
    onTechniqueDeleteClick?: (techniqueId: string) => void;

    editableCollection: boolean;
    editingTechniquesCollection: Collection | null;
    editingCollectionId: string | null;
    editingCollection: Collection | null;
    onCollectionTechniqueEditClick?: (collection: Collection) => void;
    dragDropTechniques: {index: number, technique: Technique}[] | null;
    onReorderDragDropTechniques?: (newOrder: {index: number, technique: Technique}[]) => void;
    onDragDropSaveClick?: () => void;
    onDragDropCancelClick?: () => void;
}

CollectionList.defaultProps = {
    elevation: 3,
    editableCollection: false,
    editableTechniques: false,
    orderedTechniques: true,
    checkboxTechniques: false,
    editingTechniquesCollection: null,
    editingCollectionId: null,
    editingCollection: null,
    dragDropTechniques: null,
}

function CollectionList(props: CollectionsListProps): JSX.Element {

    return (
        <React.Fragment>
            {props.filteredCollections.map(collection => {            
                let collectionTechniques: Technique[] = []

                collection.collectionTechniques.sort((a, b) => a.order - b.order)

                collection.collectionTechniques.forEach(collectionTechnique => {
                    collectionTechniques.push(collectionTechnique.technique)
                });

            return (
                <Accordion disableGutters elevation={props.elevation} key={collection.collectionId}>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1a-content"
                    >
                        <Typography variant="h6">{collection.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SubCard elevation={0}>
                            <SubAccordion elevation={0} disableGutters square defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <Box display="flex" alignItems="center" justifyContent="flex-start" width="97%">
                                            <ListItemText primary="Collection Techniques"/>
                                            {props.editableCollection && !props.editingTechniquesCollection && (
                                                <Edit onClick={(event) => { event.stopPropagation(); props.onCollectionTechniqueEditClick?.(collection); }}/>
                                            )}
                                        </Box>
                                    </ListItem>
                                </AccordionSummary>
                                <AccordionDetails sx={{padding: "0px"}}>
                                    {(props.editingTechniquesCollection?.collectionId === collection.collectionId) && props.dragDropTechniques && props.onReorderDragDropTechniques ? 
                                        <Box>
                                            <DragDropTechniquesList selectedTechniques={props.dragDropTechniques} onReorder={props.onReorderDragDropTechniques}/>
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
                                        editingTechniqueId={props.editingTechniqueId}
                                        editingTechnique={props.editingTechnique}
                                        onEditClick={props.onTechniqueEditClick}
                                        onSubmitClick={props.onTechniqueSubmitClick}
                                        onCancelClick={props.onTechniqueCancelClick}
                                        onDeleteClick={props.onTechniqueDeleteClick}
                                        />)
                                    }
                                </AccordionDetails>
                            </SubAccordion>

                            <ListItem>
                                <ListItemText primary="Description" secondary={collection.description} />
                            </ListItem>
    
                            {collection.position && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText primary="Position" secondary={collection.position.title} />
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem >
                                            <ListItemText secondary={collection.position.description} />
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            {collection.hierarchy && (
                                <ListItem>
                                    <ListItemText primary="Hierarchy" secondary={collection.hierarchy} />
                                </ListItem>
                            )}

                            {collection.type && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText primary="Type" secondary={collection.type.title} />
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText secondary={collection.type.description} />
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            {collection.openGuard && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <ListItem>
                                        <ListItemText primary="Open Guard" secondary={collection.openGuard.title} />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText secondary={collection.openGuard.description} />
                                    </ListItem>
                                </SubAccordion>
                            )}

                            {collection.gi && (
                                <ListItem>
                                    <ListItemText primary="Gi or No Gi" secondary={collection.gi} />
                                </ListItem>
                            )}
                            
                            {collection.globalNotes && (
                                <ListItem>
                                    <ListItemText primary="Global Notes" secondary={collection.globalNotes} />
                                </ListItem>
                            )}
                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )})}
        </React.Fragment>
    )
}

export default CollectionList
