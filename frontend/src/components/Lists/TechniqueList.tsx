import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Edit from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'
import { Technique } from 'common';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import MuiCard from '@mui/material/Card';
import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';


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
    paddingLeft: "0px",
    '&.MuiListItem-root.Mui-selected': {
        backgroundColor: 'inherit'
    }
})

interface ExtendedListItemTextProps extends ListItemTextProps {
    smalltext: boolean
}

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

const BaseListItemText: React.FC<ExtendedListItemTextProps> = (props) => {
    const { smalltext, ...otherProps } = props;
    return (
        <MuiListItemText 
            {...otherProps} 
            secondaryTypographyProps={{ component: 'div'}}
            primaryTypographyProps={{ component: 'div'}}
        />
    );
}

const ListItemText = styled(BaseListItemText)<ExtendedListItemTextProps>(({ theme, smalltext }) => {
    let primaryVariant = 'h6';
    let secondaryVariant = 'body1';

    if (smalltext) {
        primaryVariant = 'body1';
        secondaryVariant = 'body2';
    }
    
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
    backgroundColor: 'inherit',
})

interface TechniquesListProps {
    filteredTechniques: Technique[];
    checkbox?: boolean;
    ordered?: boolean;
    elevation: number;
    editable?: boolean;
    checkedTechniques?: {index: number, technique: Technique}[];
    onTechniqueCheck?: (techniqueId: string) => void;
    editingTechniqueId?: string | null;
    editingTechnique?: TechniqueDTO | null;
    onEditClick?: (technique: Technique) => void;
}

TechniqueList.defaultProps = {
    checkbox: false,
    elevation: 3,
    ordered: false,
    editable: false,
}

function TechniqueList(props: TechniquesListProps): JSX.Element {

    return (
        <div>
            {props.filteredTechniques.length > 0 ? (
            props.filteredTechniques.map((technique, index) => {
                let currentOrder = props.ordered ? index + 1 : null;
            return (
                <Accordion disableGutters elevation={props.elevation} key={technique.techniqueId}>
                    <AccordionSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls="panel1a-content"
                    >
                        <Box display="flex" flexDirection="row" width="100%">
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

                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" width="97%">
                                    {!props.checkbox && (
                                        <Box display="flex" alignItems="center" marginLeft="0px">
                                            {props.ordered && (
                                            <Typography variant="body1" style={{marginRight: "8px"}}>{currentOrder + ". "}</Typography>
                                            )}
                                            <Typography variant="body1">{technique?.title}</Typography>
                                        </Box>
                                    )}
                                    {props.editable && !(props.editingTechniqueId === technique.techniqueId) && !(props.editingTechniqueId) && (
                                        <Edit onClick={(event) => { event.stopPropagation(); props.onEditClick?.(technique); }}/>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SubCard elevation={0}>
                            <ListItem>                                
                                <ListItemText sx={{margin: "0px"}}
                                smalltext={(props.checkbox || props.ordered) ? true : false}
                                primary="Description"
                                secondary={technique?.description}
                                />
                            </ListItem>

                            {technique?.globalNotes && (
                                <ListItem>
                                    <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false} 
                                    primary="Global Notes"
                                    secondary={technique?.globalNotes}/>
                                </ListItem>
                            )}

                            {technique?.videoSrc && (
                                <ListItem>
                                    <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false} 
                                    primary="Video Link"
                                    secondary={technique?.videoSrc}/>
                                </ListItem>
                            )}
    
                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}
                                            primary="Position"
                                            secondary={technique?.position?.title}
                                        />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem >
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false}  
                                        secondary={technique?.position.description}/>
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            <ListItem>
                                <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                    primary="Hierarchy"
                                    secondary={technique?.hierarchy}
                                />
                            </ListItem>

                            <SubAccordion elevation={0} disableGutters square>
                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}
                                            primary="Type"
                                            secondary={technique?.type.title}
                                        />
                                    </ListItem>
                                </AccordionSummary>

                                <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                    <ListItem>
                                        <ListItemText
                                        smalltext={(props.checkbox || props.ordered) ? true : false} 
                                        secondary={technique?.type.description}/>
                                    </ListItem>
                                </AccordionDetails>
                            </SubAccordion>

                            {technique?.openGuard && (
                                <SubAccordion elevation={0} disableGutters square>
                                    <AccordionSummary expandIcon={<ExpandMore/>} sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText
                                                smalltext={(props.checkbox || props.ordered) ? true : false}
                                                primary="Open Guard"
                                                secondary={technique?.openGuard?.title}
                                            />
                                        </ListItem>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{padding: "0px", margin: "0px"}}>
                                        <ListItem>
                                            <ListItemText
                                            smalltext={(props.checkbox || props.ordered) ? true : false}   
                                            secondary={technique?.openGuard?.description}/>
                                        </ListItem>
                                    </AccordionDetails>
                                </SubAccordion>
                            )}

                            <ListItem>
                                <ListItemText
                                    smalltext={(props.checkbox || props.ordered) ? true : false}
                                    primary="Gi or No Gi"
                                    secondary={technique?.gi}
                                />
                            </ListItem>
                        </SubCard>
                    </AccordionDetails>
                </Accordion>
            )})
            ) : (
                <Card style={{backgroundColor: `#3c3836`}} elevation={0}>
                    <CardContent>
                        <Typography variant='body1'>No techniques available</Typography>
                    </CardContent>
                </Card>
            ) }
        </div>
    )
}

export default TechniqueList
