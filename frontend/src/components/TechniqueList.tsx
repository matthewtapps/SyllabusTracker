import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles'
import { Technique } from 'common';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText'

const Accordion = styled(MuiAccordion)({
    '&.MuiAccordion-root' : {
    backgroundColor: `#3c3836`,
    }
});

interface TechniquesListProps {
    filteredTechniques: Technique[];
    checkbox?: boolean;
    elevation: number;
    checkedTechniques?: string[];
    onTechniqueCheck?: (techniqueId: string) => void;
}

TechniquesList.defaultProps = {
    checkbox: false,
    elevation: 3
}

function TechniquesList(props: TechniquesListProps): JSX.Element {
   
    return (
        <React.Fragment>
            {props.filteredTechniques.map(technique => {
                const ListItemText = styled((propss: ListItemTextProps) => (
                    (props.checkbox) 
                        ? (<MuiListItemText primaryTypographyProps={{variant: 'body1'}} secondaryTypographyProps={{variant: 'body2'}}{...propss} />)
                        : (<MuiListItemText primaryTypographyProps={{variant: 'h6'}} secondaryTypographyProps={{variant: 'body1'}}{...propss} />)
                ))(({ theme }) => ({}));
            
            return (
                <Accordion disableGutters elevation={props.elevation} key={technique.techniqueId}>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1a-content"
                    >
                        {props.checkbox && (
                            <Box display="flex" alignItems="center" marginLeft="0px">
                                <Checkbox
                                    size='small'
                                    checked={props.checkedTechniques?.includes(technique.techniqueId)}
                                    onChange={() => props.onTechniqueCheck?.(technique.techniqueId)}
                                    onClick={e => e.stopPropagation()}
                                />
                                <Typography variant="body1">{technique.title}</Typography>
                            </Box>
                        )}

                        {!props.checkbox && (
                            <Typography variant="h6">{technique.title}</Typography>
                        )}
                    </AccordionSummary>
                    <AccordionDetails>
                        <ListItem>
                            <ListItemText primary="Description" secondary={technique.description} />
                        </ListItem>

                        <ListItem>
                            <ListItemText primary="Position" secondary={technique.position.title} />
                        </ListItem>

                        <ListItem>
                            <ListItemText secondary={technique.position.description} />
                        </ListItem>

                        <ListItem>
                            <ListItemText primary="Hierarchy" secondary={technique.hierarchy} />
                        </ListItem>

                        <ListItem>
                            <ListItemText primary="Type" secondary={technique.type.title} />
                        </ListItem>

                        <ListItem>
                            <ListItemText secondary={technique.type.description} />
                        </ListItem>

                        {technique.openGuard && (
                            <div>
                                <ListItem>
                                    <ListItemText primary="Open Guard" secondary={technique.openGuard.title} />
                                </ListItem>

                                <ListItem>
                                    <ListItemText secondary={technique.openGuard.description} />
                                </ListItem>
                            </div>
                        )}

                        <ListItem>
                            <ListItemText primary="Gi or No Gi" secondary={technique.gi} />
                        </ListItem>
                        
                        {technique.globalNotes && (
                            <ListItem>
                                <ListItemText primary="Global Notes" secondary={technique.globalNotes} />
                            </ListItem>
                        )}
                    </AccordionDetails>
                </Accordion>
            )})}
        </React.Fragment>
    )
}
    
export default TechniquesList
