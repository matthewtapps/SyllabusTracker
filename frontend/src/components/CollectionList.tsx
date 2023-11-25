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
import { FastTextField as TextField } from './FastTextField';
import theme from '../theme/Theme';


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
    collectionTechniques: CollectionTechnique[] | null;
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
    onCollectionEditClick?: (collection: Collection) => void;
    onCollectionSaveClick?: (event: React.FormEvent<HTMLFormElement>) => void;
    onCollectionCancelClick?: () => void;
    onCollectionDeleteClick?: () => void;
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
}

function CollectionList(props: CollectionsListProps): JSX.Element {
    const [wasSubmitted, setWasSubmitted] = React.useState(false)

    return (
        <form noValidate onSubmit={props.onCollectionSaveClick}>
            {props.filteredCollections.map(collection => {         

                let collectionTechniques: Technique[] = []

                if (props.collectionTechniques) {
                    const filteredAndSortedTechniques = props.collectionTechniques
                        .filter(ct => ct.collection.collectionId === collection.collectionId)
                        .sort((a, b) => a.order - b.order)
                        .map(ct => ct.technique);
                    
                    collectionTechniques = filteredAndSortedTechniques;
                } else {
                    collection.collectionTechniques.sort((a, b) => a.order - b.order)
                    collection.collectionTechniques.forEach(collectionTechnique => {
                        collectionTechniques.push(collectionTechnique.technique)
                    });
                }
            return (
                <Accordion disableGutters elevation={props.elevation} key={collection.collectionId}>
                    <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="panel1a-content">
                        <Box display="flex" flexDirection="column" flexGrow={1}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                {(props.editingCollectionId === collection.collectionId) ? (
                                    <TextField wasSubmitted={wasSubmitted} size="medium" style={{width: "100%"}} fullWidth
                                    defaultValue={collection?.title} name="title" label="Title" onClick={e => e.stopPropagation()}/>
                                    ) : 
                                    <Typography variant="h6">{collection.title}</Typography>
                                }
                                {props.editableCollection && !(props.editingCollectionId === collection.collectionId) && !(props.editingCollectionId) && (
                                    <Edit onClick={(event) => { event.stopPropagation(); props.onCollectionEditClick?.(collection); }}/>
                                )}
                            </Box>
                            {props.editingCollectionId === collection.collectionId && (
                                    <Box display="flex" justifyContent="space-between" alignItems="center" width="97%" mt={1}>
                                        <Button type="submit" onClick={(event) => { event.stopPropagation(); }}>Save</Button>
                                        <Button onClick={(event) => { event.stopPropagation(); props.onCollectionCancelClick?.()}}>Cancel</Button>
                                        <Button onClick={(event) => { event.stopPropagation(); props.onCollectionDeleteClick?.() }} 
                                            style={{backgroundColor: theme.palette.error.main}} >Delete</Button>
                                    </Box>
                                )}
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SubCard elevation={0}>
                            <SubAccordion elevation={0} disableGutters square defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <Box display="flex" alignItems="center" justifyContent="flex-start" width="97%">
                                            <ListItemText primary="Collection Techniques"/>
                                            {props.editableCollection && !props.editingTechniquesCollection && !props.editingTechniqueId && (
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
                                <ListItemText primary="Description" secondary={(props.editingCollectionId === collection.collectionId) ? 
                                    <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                    defaultValue={collection.description} multiline rows={4} name="description"/> : 
                                    collection?.description
                                } />                                
                            </ListItem>
                                                        
                            {(collection.globalNotes || props.editingCollectionId === collection.collectionId) && (
                                <ListItem>
                                    <ListItemText primary="Global Notes" secondary={(props.editingCollectionId === collection.collectionId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={collection.globalNotes} name="globalNotes"/> : 
                                        collection.globalNotes} />
                                </ListItem>
                            )}
    
                            {(collection.position || props.editingCollectionId === collection.collectionId) && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText primary="Position" secondary={(props.editingCollectionId === collection.collectionId) ? 
                                                <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                                defaultValue={collection.position?.title} name="position"/> : 
                                                collection.position?.title} />
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem >
                                            <ListItemText secondary={(props.editingCollectionId === collection.collectionId) ? 
                                                <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                                defaultValue={collection.position?.description} multiline rows={4} name="positionDescription"/> :
                                                collection.position?.description} />
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            {(collection.hierarchy || props.editingCollectionId === collection.collectionId) && (
                                <ListItem>
                                    <ListItemText primary=" Hierarchy" secondary={(props.editingCollectionId === collection.collectionId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={collection.hierarchy} name="hierarchy"/> :
                                        collection.hierarchy} />
                                </ListItem>
                            )}

                            {(collection.type || props.editingCollectionId === collection.collectionId) && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText primary="Type" secondary={(props.editingCollectionId === collection.collectionId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={collection.type?.title} name="type"/> :
                                        collection.type?.title} />
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText secondary={(props.editingCollectionId === collection.collectionId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={collection.type?.description} multiline rows={4} name="typeDescription"/> :
                                        collection.type?.description} />
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            {(collection.openGuard || props.editingCollectionId === collection.collectionId) && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <ListItem>
                                        <ListItemText primary="Open Guard" secondary={(props.editingCollectionId === collection.collectionId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={collection.openGuard?.title} name="openGuard"/> :
                                        collection.openGuard?.title} />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText secondary={(props.editingCollectionId === collection.collectionId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={collection.openGuard?.description} multiline rows={4} name="openGuardDescription"/> :
                                        collection.openGuard?.description} />
                                    </ListItem>
                                </SubAccordion>
                            )}

                            {(collection.gi || props.editingCollectionId === collection.collectionId) && (
                                <ListItem>
                                    <ListItemText primary="Gi or No Gi" secondary={(props.editingCollectionId === collection.collectionId) ? 
                                        <TextField wasSubmitted={wasSubmitted} size="small" fullWidth style={{marginRight: "20px"}} 
                                        defaultValue={collection.gi} name="gi"/> :
                                        collection.gi} />
                                </ListItem>
                            )}

                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )})}
        </form>
    )
}

export default CollectionList
