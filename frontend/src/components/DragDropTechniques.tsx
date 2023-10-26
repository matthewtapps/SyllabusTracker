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
    '&:not(:last-child)': {
        borderBottom: '1px solid #7c6f64'
    }
});

interface DragDropTechniquesListProps {
    selectedTechniques: { index: number, technique: Technique }[];
    onReorder: (newOrder: { index: number, technique: Technique }[]) => void;
}

const DragDropTechniquesList: React.FC<DragDropTechniquesListProps> = ({ selectedTechniques, onReorder }) => {
    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedTechniques = Array.from(selectedTechniques);
        const [reorderedItem] = reorderedTechniques.splice(result.source.index, 1);
        reorderedTechniques.splice(result.destination.index, 0, reorderedItem);
        onReorder(reorderedTechniques);
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="techniques">
                {(provided) => (
                    <Card elevation={0} {...provided.droppableProps} ref={provided.innerRef}>
                        {selectedTechniques.map((item, index) => (
                            <Draggable key={item.technique.techniqueId} draggableId={item.technique.techniqueId} index={index}>
                                {(provided) => (
                                    <AccordionWrapper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <Accordion elevation={0} disableGutters square>
                                            <AccordionSummary>
                                                <Box display="flex" alignItems="center">
                                                    <DragHandleIcon style={{ marginRight: "8px" }} />
                                                    <Typography variant="h6">
                                                        {item.technique.title}
                                                    </Typography>
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
    );
}

export default DragDropTechniquesList;