import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Technique } from 'common';
import MuiCard from '@mui/material/Card';
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import DragHandleIcon from '@mui/icons-material/DragHandle'; // Suitable drag handle
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';


const Card = styled(MuiCard)({
    backgroundColor: "inherit",
});

const Accordion = styled(MuiAccordion)({
    backgroundColor: `#3c3836`,
    boxShadow: 'none',
    '&:before': {
        display: 'none'
    }
});

const AccordionWrapper = styled('div')({
    borderBottom: '1px solid #7c6f64'
});

interface DragDropTechniquesListProps {
    selectedTechniques: { index: number, technique: Technique }[];
    onReorder: (newOrder: { index: number, technique: Technique }[]) => void;
    onAddTechniqueClick?: () => void;
    onDragDropDeleteClick?: (deletedTechnique: {index: number, technique: Technique}) => void;
    editable: boolean;
}

DragDropTechniquesList.defaultProps = {
    editable: false
}

function DragDropTechniquesList(props: DragDropTechniquesListProps): JSX.Element {
    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedTechniques = Array.from(props.selectedTechniques);
        const [reorderedItem] = reorderedTechniques.splice(result.source.index, 1);
        reorderedTechniques.splice(result.destination.index, 0, reorderedItem);
        console.log(reorderedTechniques)
        props.onReorder(reorderedTechniques);
    };

    return (
        (props.selectedTechniques.length === 0)  ? (
            <Card elevation={0}>
                <Accordion elevation={0} disableGutters square sx={{borderBottom: '1px solid #7c6f64'}}>
                    <AccordionSummary>
                        <Typography variant="body1">
                            No techniques in collection
                        </Typography>
                    </AccordionSummary>
                </Accordion>
                {props.editable && (
            <Accordion disableGutters square elevation={0}>
                <AccordionSummary >
                    <Box display="flex" width="100%" alignItems="center" justifyContent='center'>
                        <Button 
                        onClick={props.onAddTechniqueClick}
                        size="large" 
                        style={{position: "absolute", top: "0", left: "0", right: "0", bottom: "0"}}
                        fullWidth>
                            <AddIcon style={{ marginRight: "8px" }}/>
                        </Button>                        
                    </Box>
                </AccordionSummary>
            </Accordion>
            )}
            </Card>
            
        ) : (
        <Card elevation={0} >
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="techniques">
                    {(provided) => (
                        <Card elevation={0} {...provided.droppableProps} ref={provided.innerRef}>
                            {props.selectedTechniques.map((item, index) => (
                                <Draggable key={item.technique.techniqueId} draggableId={item.technique.techniqueId} index={index}>
                                    {(provided) => (
                                        <AccordionWrapper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <Accordion elevation={0} disableGutters square>
                                                <AccordionSummary>
                                                    <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                                        <Box width="100%" display="flex" alignItems="center">
                                                            <DragHandleIcon style={{ marginRight: "8px" }} />
                                                            <Typography variant="body1">
                                                                {item.technique.title}
                                                            </Typography>
                                                        </Box>
                                                        <IconButton 
                                                        onClick={e => {props.onDragDropDeleteClick?.({index: item.index, technique: item.technique})}}
                                                        sx={{padding: "0px"}}>
                                                            <DeleteIcon/>                                             
                                                        </IconButton>
                                                    </Box>
                                                </AccordionSummary>
                                            </Accordion>
                                        </AccordionWrapper>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Card>
                    )}
                </Droppable>
            </DragDropContext>
            {props.editable && (
            <Accordion disableGutters square elevation={0}>
                <AccordionSummary >
                    <Box display="flex" width="100%" alignItems="center" justifyContent='center'>
                        <Button 
                        onClick={props.onAddTechniqueClick}
                        size="large" 
                        style={{position: "absolute", top: "0", left: "0", right: "0", bottom: "0"}}
                        fullWidth>
                            <AddIcon style={{ marginRight: "8px" }}/>
                        </Button>                        
                    </Box>
                </AccordionSummary>
            </Accordion>
            )}
        </Card>
        )
    );
}

export default DragDropTechniquesList;
