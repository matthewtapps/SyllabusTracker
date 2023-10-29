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
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import MuiCard from '@mui/material/Card';

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
    paddingBottom: "0px"
})

interface TechniquesListProps {
    filteredTechniques: Technique[];
    checkbox?: boolean;
    ordered?: boolean;
    elevation: number;
    checkedTechniques?: {index: number, technique: Technique}[];
    onTechniqueCheck?: (techniqueId: string) => void;
}

TechniqueList.defaultProps = {
    checkbox: false,
    elevation: 3,
    ordered: false
}

function TechniqueList(props: TechniquesListProps): JSX.Element {

    return (
        <React.Fragment>
            {props.filteredTechniques.map((technique, index) => {
                const ListItemText = styled((propss: ListItemTextProps) => (
                    (props.ordered || props.checkbox) 
                        ? (<MuiListItemText primaryTypographyProps={{variant: 'body1'}} secondaryTypographyProps={{variant: 'body2'}}{...propss} />)
                        : (<MuiListItemText primaryTypographyProps={{variant: 'h6'}} secondaryTypographyProps={{variant: 'body1'}}{...propss} />)
                ))(({ theme }) => ({}));

                const SubCard = styled(MuiCard)({
                    backgroundColor: 'inherit'
                })

                let currentOrder = props.ordered ? index + 1 : null;            
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
                                    checked={props.checkedTechniques?.some(item => item.technique === technique)}
                                    onChange={() => props.onTechniqueCheck?.(technique.techniqueId)}
                                    onClick={e => e.stopPropagation()}
                                />
                                <Typography variant="body1">{technique.title}</Typography>
                            </Box>
                        )}

                        {props.ordered && (
                            <Box display="flex" alignItems="center" marginLeft="0px">
                                <Typography variant="body1">{currentOrder + ". "}</Typography>
                                <Typography variant="body1" style={{marginLeft: "8px"}}>{technique.title}</Typography>
                            </Box>
                        )}

                        {!props.checkbox && ! props.ordered &&(
                            <Typography variant="h6">{technique?.title}</Typography>
                        )}
                    </AccordionSummary>
                    <AccordionDetails>
                        <SubCard elevation={0}>
                            <ListItem>
                                <ListItemText primary="Description" secondary={technique?.description} />
                            </ListItem>
    
                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText primary="Position" secondary={technique?.position.title} />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem >
                                        <ListItemText secondary={technique?.position.description} />
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            <ListItem>
                                <ListItemText primary="Hierarchy" secondary={technique?.hierarchy} />
                            </ListItem>

                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText primary="Type" secondary={technique?.type.title} />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText secondary={technique?.type.description} />
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            {technique.openGuard && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <ListItem>
                                        <ListItemText primary="Open Guard" secondary={technique?.openGuard.title} />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText secondary={technique?.openGuard.description} />
                                    </ListItem>
                                </SubAccordion>
                            )}

                            <ListItem>
                                <ListItemText primary="Gi or No Gi" secondary={technique?.gi} />
                            </ListItem>
                            
                            {technique.globalNotes && (
                                <ListItem>
                                    <ListItemText primary="Global Notes" secondary={technique?.globalNotes} />
                                </ListItem>
                            )}
                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )})}
        </React.Fragment>
    )
}

export default TechniqueList
